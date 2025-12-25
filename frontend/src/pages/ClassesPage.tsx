import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { classApi, subjectApi, userApi } from '@/api/apiClient';
import { Class, Subject, User } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Users, BookOpen, Trash2, Edit, Search } from 'lucide-react';

export default function ClassesPage() {
    const { user } = useAuthStore();
    const { toast, dismiss } = useToast();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const [classesData, subjectsData, usersData] = await Promise.all([
                classApi.getAll(),
                subjectApi.getAll(user?.institutionId),
                userApi.getAll({ institutionId: user?.institutionId })
            ]);
            setClasses(classesData || []);
            setSubjects(subjectsData || []);
            const userList = usersData?.data || [];
            setTeachers(userList.filter(u => u.role === 'teacher'));
        } catch (error) {
            console.error('Failed to load data', error);
            toast({ title: t('common.error_default'), description: String(error), variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        const toastId = toast({
            title: t('classes.delete_confirm'),
            action: (
                <div className="flex gap-2 w-full justify-end">
                    <Button variant="outline" onClick={() => dismiss(toastId.id)}>{t('common.cancel')}</Button>
                    <Button variant="destructive" onClick={async () => {
                        dismiss(toastId.id);
                        try {
                            const response = await classApi.delete(id);
                            if (response.error) {
                                throw new Error(response.error);
                            }
                            toast({ title: t('common.success') });
                            fetchClasses();
                        } catch (error) {
                            toast({ title: t('common.error_default'), description: String(error), variant: "destructive" });
                        }
                    }}>{t('common.delete')}</Button>
                </div>
            ),
        });
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('classes.title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('classes.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari kelas..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate('/classes/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('classes.create_class')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        {search ? "Tidak ada kelas yang cocok dengan pencarian" : "Belum ada kelas dibuat"}
                    </div>
                ) : (
                    filteredClasses.map((cls) => {
                        const subject = subjects.find(s => s.id === cls.subjectId);
                        const teacher = teachers.find(t => t.id === cls.teacherId);
                        // Parse studentIds safe
                        let studentCount = 0;
                        try {
                            const parsed = typeof cls.studentIds === 'string' ? JSON.parse(cls.studentIds) : cls.studentIds;
                            studentCount = Array.isArray(parsed) ? parsed.length : 0;
                        } catch { }

                        return (
                            <Card key={cls.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline">{subject?.name || t('classes.unknown_subject')}</Badge>
                                        <div className="flex gap-1">
                                            <Link to={`/classes/${cls.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cls.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-2">{cls.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{teacher?.name || t('classes.no_teacher')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{t('classes.students_count', { count: studentCount })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </DashboardLayout>
    );
}
