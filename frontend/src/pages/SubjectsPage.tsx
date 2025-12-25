import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { BookOpen, MoreHorizontal, Search, Loader2, Save, X, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { subjectApi, userApi, institutionApi } from '@/api/apiClient';
import { Subject, User, Institution } from '@/types';
import { TeacherTransferList } from '@/components/TeacherTransferList';

const SubjectsPage = () => {
    const { toast } = useToast();
    const { t } = useTranslation();

    // Data
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);

    // Pagination & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dialog & Form
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        credits: 2,
        deptId: "dept-1", // Default placeholder
        teacherIds: [] as string[]
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
            const currentUser = authState?.state?.user;
            const institutionId = currentUser?.institutionId;

            if (!institutionId) {
                console.warn("No institution ID found");
            }

            const [subjData, instData, usersData] = await Promise.all([
                subjectApi.getAll(institutionId),
                institutionApi.getAll(),
                userApi.getAll({
                    limit: 100,
                    page: 1,
                    role: 'teacher',
                    institutionId: institutionId
                })
            ]);

            setSubjects(subjData || []);
            setInstitutions(instData);
            setTeachers(usersData.data);

        } catch (error) {
            toast({ title: t('subjects.toast.load_fail'), description: String(error), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const openCreateDialog = () => {
        setEditingSubject(null);
        setFormData({ name: "", code: "", credits: 2, deptId: "dept-1", teacherIds: [] });
        setIsDialogOpen(true);
    };

    const openEditDialog = (sub: Subject) => {
        setEditingSubject(sub);
        setFormData({
            name: sub.name,
            code: sub.code,
            credits: sub.credits,
            deptId: "dept-1",
            teacherIds: sub.teacherIds || (sub.teacherId ? [sub.teacherId] : [])
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            if (editingSubject) {
                await subjectApi.update(editingSubject.id, {
                    name: formData.name,
                    code: formData.code,
                    credits: formData.credits,
                    departmentId: formData.deptId,
                    teacherIds: formData.teacherIds
                });
                toast({ title: t('subjects.toast.update_success') });
            } else {
                await subjectApi.create({
                    name: formData.name,
                    code: formData.code,
                    credits: formData.credits,
                    departmentId: formData.deptId,
                    teacherIds: formData.teacherIds
                });
                toast({ title: t('subjects.toast.create_success') });
            }
            setIsDialogOpen(false);
            fetchInitialData();
        } catch (error) {
            toast({ title: t('common.error_default'), description: String(error), variant: "destructive" });
        }
    };

    const handleTeacherChange = (newIds: string[]) => {
        setFormData(prev => ({ ...prev, teacherIds: newIds }));
    };

    // Filter and Pagination Logic
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
    const paginatedSubjects = filteredSubjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('subjects.title')}</h1>
                        <p className="text-muted-foreground mt-2">{t('subjects.subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-[250px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari mapel atau kode..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={openCreateDialog}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            {t('subjects.add_subject')}
                        </Button>
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('subjects.table.code')}</TableHead>
                                <TableHead>{t('subjects.table.name')}</TableHead>
                                <TableHead>{t('subjects.table.credits')}</TableHead>
                                <TableHead>{t('subjects.table.teachers')}</TableHead>
                                <TableHead className="w-[80px]">{t('users.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredSubjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {searchQuery ? "No subjects found matching your search." : "No subjects found."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedSubjects.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-mono">{sub.code}</TableCell>
                                        <TableCell className="font-medium">{sub.name}</TableCell>
                                        <TableCell>{sub.credits}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {sub.teachers && sub.teachers.length > 0 ? (
                                                    sub.teachers.map(t => (
                                                        <Badge key={t.id} variant="secondary" className="text-xs">
                                                            {t.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(sub)}>
                                                        {t('subjects.edit_subject')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">{t('subjects.delete')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {!loading && filteredSubjects.length > 0 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {filteredSubjects.length} total subjects.
                        </div>
                        <div className="space-x-2 flex items-center">
                            <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Full Screen Stats/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-none w-screen h-screen m-0 rounded-none flex flex-col p-0">
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-background">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                                <div>
                                    <DialogTitle className="text-xl">
                                        {editingSubject ? t('subjects.edit_subject') : t('subjects.add_subject')}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1">
                                        {t('subjects.subtitle')}
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}> {t('subjects.cancel')} </Button>
                                <Button onClick={() => handleSubmit(undefined)}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('subjects.save_changes')}
                                </Button>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-auto bg-muted/10 p-6">
                            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left Col: Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                                            {t('subjects.basic_info')}
                                        </h3>
                                        <div className="space-y-4 bg-background p-6 rounded-lg border shadow-sm">
                                            <div className="space-y-2">
                                                <Label htmlFor="code">{t('subjects.form.code')}</Label>
                                                <Input
                                                    id="code"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                    placeholder={t('subjects.form.placeholders.code')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{t('subjects.form.name')}</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder={t('subjects.form.placeholders.name')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="credits">{t('subjects.form.credits')}</Label>
                                                <Input
                                                    id="credits"
                                                    type="number"
                                                    value={formData.credits}
                                                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                                                    placeholder="2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Teacher Assignment (Larger) */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                            {t('subjects.assigned_teachers')}
                                        </h3>
                                        {/* Transfer List Component */}
                                        <div className="h-[600px]">
                                            <TeacherTransferList
                                                allTeachers={teachers}
                                                selectedTeacherIds={formData.teacherIds}
                                                onChange={handleTeacherChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default SubjectsPage;
