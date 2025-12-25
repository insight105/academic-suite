import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/stores/quizStore';
import { batchApi, attemptApi } from '../api/apiClient';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Loader2,
    RefreshCw,
    PauseCircle,
    PlayCircle,
    CheckCircle,
    AlertCircle,
    Clock,
    Wifi,
    WifiOff
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LiveStatus {
    attemptId: string;
    studentId: string;
    studentName: string;
    status: string;
    isOnline: boolean;
    currentQuestionIdx: number;
    lastActiveAt: string;
    isPaused: boolean;
    score: number;
}

export default function LiveMonitorPage() {
    const { batchId } = useParams<{ batchId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [liveData, setLiveData] = useState<LiveStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async () => {
        if (!batchId) return;
        try {
            const data = await batchApi.getBatchLiveStatus(batchId);
            setLiveData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch live data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        return () => stopPolling();
    }, [batchId]);

    useEffect(() => {
        if (isPolling) {
            pollingRef.current = setInterval(fetchData, 5000); // Poll every 5 seconds
        } else {
            stopPolling();
        }
        return () => stopPolling();
    }, [isPolling, batchId]);

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const handlePause = async (attemptId: string) => {
        try {
            await attemptApi.pauseAttempt(attemptId);
            toast({ title: "Ujian dipause", description: "Siswa tidak dapat melanjutkan ujian sementara." });
            fetchData();
        } catch (error) {
            toast({ title: "Gagal pause", variant: "destructive" });
        }
    };

    const handleResume = async (attemptId: string) => {
        try {
            await attemptApi.resumeAttempt(attemptId);
            toast({ title: "Ujian dilanjutkan", description: "Siswa dapat melanjutkan ujian kembali." });
            fetchData();
        } catch (error) {
            toast({ title: "Gagal resume", variant: "destructive" });
        }
    };

    const handleForceSubmit = async (attemptId: string) => {
        try {
            await attemptApi.forceSubmitAttempt(attemptId);
            toast({ title: "Sukses Submit Paksa", description: "Ujian siswa telah diselesaikan." });
            fetchData();
        } catch (error) {
            toast({ title: "Gagal submit paksa", variant: "destructive" });
        }
    };

    // Stats
    const totalStudents = liveData.length;
    const onlineCount = liveData.filter(s => s.isOnline && s.status === 'ACTIVE' && !s.isPaused).length;
    const submittedCount = liveData.filter(s => s.status === 'SUBMITTED' || s.status === 'EXPIRED').length;
    const activeCount = liveData.filter(s => s.status === 'ACTIVE').length;

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 px-2 py-0.5 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE MONITOR
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Pemantauan Ujian Real-time</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsPolling(!isPolling)}>
                        {isPolling ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                        {isPolling ? 'Pause Update' : 'Resume Update'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={fetchData}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Peserta</p>
                            <h2 className="text-3xl font-bold">{totalStudents}</h2>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sedang Online</p>
                            <h2 className="text-3xl font-bold text-green-600">{onlineCount}</h2>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <Wifi className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Mengerjakan</p>
                            <h2 className="text-3xl font-bold text-orange-600">{activeCount}</h2>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Selesai</p>
                            <h2 className="text-3xl font-bold text-gray-600">{submittedCount}</h2>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Status Peserta</CardTitle>
                    <CardDescription>Monitoring aktivitas peserta secara real-time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Peserta</TableHead>
                                    <TableHead>Status Online</TableHead>
                                    <TableHead>Status Ujian</TableHead>
                                    <TableHead>Progress (Question)</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : liveData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Belum ada peserta yang memulai ujian.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    liveData.map((student) => (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">
                                                {student.studentName}
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                                                    {student.studentId}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {student.isOnline ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        <Wifi className="h-3 w-3 mr-1" /> Online
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                                        <WifiOff className="h-3 w-3 mr-1" /> Offline
                                                    </Badge>
                                                )}
                                                {student.lastActiveAt && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Active: {format(new Date(student.lastActiveAt), "HH:mm:ss")}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {student.status === 'ACTIVE' ? (
                                                    student.isPaused ? (
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                            <PauseCircle className="h-3 w-3 mr-1" /> PAUSED
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                                            Sedang Mengerjakan
                                                        </Badge>
                                                    )
                                                ) : student.status === 'SUBMITTED' ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Selesai</Badge>
                                                ) : (
                                                    <Badge variant="destructive">{student.status}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {student.status === 'ACTIVE' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">No. {student.currentQuestionIdx + 1 || 1}</span>
                                                        {/* We could show progress bar if we knew total questions here, but simpler is fine */}
                                                    </div>
                                                )}
                                                {(student.status === 'SUBMITTED' || student.status === 'EXPIRED') && (
                                                    <span className="text-sm font-medium">Score: {Math.round(student.score * 10) / 10}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {student.status === 'ACTIVE' && (
                                                        <>
                                                            {student.isPaused ? (
                                                                <Button size="sm" variant="outline" onClick={() => handleResume(student.attemptId)}>
                                                                    <PlayCircle className="h-4 w-4 mr-1" /> Resume
                                                                </Button>
                                                            ) : (
                                                                <Button size="sm" variant="outline" onClick={() => handlePause(student.attemptId)}>
                                                                    <PauseCircle className="h-4 w-4 mr-1" /> Pause
                                                                </Button>
                                                            )}

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button size="sm" variant="destructive">
                                                                        Stop/Force
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Paksa Selesai Ujian?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Apakah Anda yakin ingin menghentikan ujian untuk <b>{student.studentName}</b>?
                                                                            Ujian akan langsung disubmit dengan jawaban yang tersimpan saat ini.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleForceSubmit(student.attemptId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                            Ya, Paksa Selesai
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
