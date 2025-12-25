import { useState, useMemo } from "react";
import { User } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, ChevronLeft, X, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TeacherTransferListProps {
    allTeachers: User[];
    selectedTeacherIds: string[];
    onChange: (ids: string[]) => void;
}

export function TeacherTransferList({
    allTeachers,
    selectedTeacherIds,
    onChange,
}: TeacherTransferListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const availableTeachers = useMemo(() => {
        return allTeachers
            .filter((t) => !selectedTeacherIds.includes(t.id))
            .filter((t) =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [allTeachers, selectedTeacherIds, searchQuery]);

    const selectedTeachers = useMemo(() => {
        return allTeachers.filter((t) => selectedTeacherIds.includes(t.id));
    }, [allTeachers, selectedTeacherIds]);

    const handleAdd = (id: string) => {
        onChange([...selectedTeacherIds, id]);
    };

    const handleRemove = (id: string) => {
        onChange(selectedTeacherIds.filter((tid) => tid !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
            {/* Available List */}
            <Card className="flex flex-col h-full border-muted-foreground/20 shadow-sm">
                <CardHeader className="py-3 px-4 border-b bg-muted/30">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                        <span>Tersedia ({availableTeachers.length})</span>
                    </CardTitle>
                    <div className="mt-2 relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari guru..."
                            className="pl-8 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[calc(100vh-350px)]">
                        <div className="p-2 space-y-1">
                            {availableTeachers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Tidak ada guru ditemukan
                                </div>
                            ) : (
                                availableTeachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors group cursor-pointer"
                                        onClick={() => handleAdd(teacher.id)}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">{teacher.name}</span>
                                            <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Selected List */}
            <Card className="flex flex-col h-full border-blue-200 shadow-sm ring-1 ring-blue-500/10 dark:ring-blue-500/20">
                <CardHeader className="py-3 px-4 border-b bg-blue-50/50 dark:bg-blue-900/10">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Terpilih ({selectedTeachers.length})
                    </CardTitle>
                    <div className="h-9 mt-2 flex items-center">
                        <p className="text-xs text-muted-foreground">Guru yang dipilih akan mengajar mata pelajaran ini.</p>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[calc(100vh-350px)]">
                        <div className="p-2 space-y-1">
                            {selectedTeachers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm italic">
                                    Belum ada guru dipilih
                                </div>
                            ) : (
                                selectedTeachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        className="flex items-center justify-between p-2 rounded-md bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 group"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{teacher.name}</span>
                                            <span className="text-xs text-blue-700/70 dark:text-blue-300/70">{teacher.email}</span>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleRemove(teacher.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
