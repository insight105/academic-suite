import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useAuthStore } from '@/stores/authStore';
import { classApi, subjectApi, userApi, Class, Subject, User } from '@/api/apiClient';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClassFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { toast } = useToast();

    const isEditing = id && id !== 'new';

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [studentsWithClass, setStudentsWithClass] = useState<Set<string>>(new Set());

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        subjectId: '',
        teacherId: '',
        studentIds: [] as string[]
    });

    // UI State
    const [openSubject, setOpenSubject] = useState(false);
    const [filterNoClass, setFilterNoClass] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [subjectsData, usersData, allClasses] = await Promise.all([
                subjectApi.getAll(user?.institutionId),
                userApi.getAll({ institutionId: user?.institutionId, limit: 1000 }),
                classApi.getAll()
            ]);

            setSubjects(subjectsData || []);
            const userList = usersData?.data || [];
            setTeachers(userList.filter(u => u.role === 'teacher'));
            setStudents(userList.filter(u => u.role === 'student'));

            // Calculate students who are already in a class
            const assignedStudents = new Set<string>();
            allClasses.forEach((c: Class) => {
                // If editing, don't count the current class's students as "assigned" elsewhere
                // so they stay visible if we removed them and want to add back?
                // Actually, logic is: 'studentsWithClass' means they are in ANY class.
                // We might want to exclude the current class from this check if we want to allow re-adding them.
                // But usually a student can be in multiple classes (different subjects).
                // Wait, if the requirement is "Show students who don't have a class", it usually implies
                // "don't have ANY class" or "don't have THIS class"?
                // "mahasiswa yang belum punya kelas" -> likely means "haven't been assigned to any class group yet".
                // In many schools, a student belongs to exactly one "Class Group" (e.g. 10A).
                // But here classes have SubjectID. So a Class is Subject-Specific?
                // Looking at the form, it has SubjectID. So "Class" here is a "Subject Class" (e.g. Math 10A).
                // If so, a student definitely has multiple classes.
                // HOWEVER, maybe the request implies "students not in any class FOR THIS SUBJECT"?
                // OR, perhaps "Class" here is a "Homeroom/Rombel" concept?
                // Let's look at `Subject` model. It has `departmentId`.
                // In database seeder:
                // DB.Where(models.Subject{ID: subjectID}).Attrs(models.Subject{ ... })
                //
                // The request says "mahasiswa yang belum punya kelas".
                // If the system treats "Class" as "Rombel" (Classroom group), then a student usually has only one.
                // If "Class" is subject-based, it's different.
                // Given the User request "mahasiswa yang belum punya kelas", it strongly suggests "Student has 0 classes assigned".
                // Let's implement that: Students present in 0 'classes' records.

                if (c.id === id) return; // Exclude current class if editing (so we don't mark these students as unavailable if they are only in this class)

                let sIds: string[] = [];
                try {
                    sIds = typeof c.studentIds === 'string' ? JSON.parse(c.studentIds) : c.studentIds;
                } catch { sIds = [] }

                if (Array.isArray(sIds)) {
                    sIds.forEach(sid => assignedStudents.add(sid));
                }
            });
            setStudentsWithClass(assignedStudents);

            if (isEditing && id) {
                const cls = await classApi.getById(id);
                if (cls) {
                    let sIds: string[] = [];
                    try {
                        sIds = typeof cls.studentIds === 'string' ? JSON.parse(cls.studentIds) : cls.studentIds;
                    } catch { sIds = [] }

                    setFormData({
                        name: cls.name,
                        subjectId: cls.subjectId,
                        teacherId: cls.teacherId,
                        studentIds: sIds
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load data', error);
            toast({ title: "Gagal memuat data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                studentIds: JSON.stringify(formData.studentIds) as any
            };

            if (isEditing && id) {
                await classApi.update(id, payload);
                toast({ title: "Kelas berhasil diperbarui" });
            } else {
                await classApi.create(payload);
                toast({ title: "Kelas berhasil dibuat" });
            }
            navigate('/classes');
        } catch (error) {
            console.error('Failed to save class', error);
            toast({ title: "Gagal menyimpan kelas", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Dual List State
    const [availableSearch, setAvailableSearch] = useState("");
    const [selectedSearch, setSelectedSearch] = useState("");

    const availableStudents = useMemo(() => {
        const selectedSet = new Set(formData.studentIds);
        return students.filter(s => {
            // 1. Not already selected
            if (selectedSet.has(s.id)) return false;

            // 2. Filter by Search
            const matchesSearch = s.name.toLowerCase().includes(availableSearch.toLowerCase()) ||
                s.email.toLowerCase().includes(availableSearch.toLowerCase());

            if (!matchesSearch) return false;

            // 3. Filter "Belum Punya Kelas" (Checkbox)
            if (filterNoClass) {
                // Return TRUE only if student is NOT in studentsWithClass
                return !studentsWithClass.has(s.id);
            }

            return true;
        });
    }, [students, formData.studentIds, availableSearch, filterNoClass, studentsWithClass]);

    const selectedStudentsList = useMemo(() => {
        const selectedSet = new Set(formData.studentIds);
        // We filter from 'students' again to get full objects, assuming 'students' has all users.
        // If 'students' list is huge, this is fine for ~1000 items.
        return students.filter(s =>
            selectedSet.has(s.id) &&
            (s.name.toLowerCase().includes(selectedSearch.toLowerCase()) ||
                s.email.toLowerCase().includes(selectedSearch.toLowerCase()))
        );
    }, [students, formData.studentIds, selectedSearch]);

    const addStudent = (id: string) => {
        setFormData(prev => ({
            ...prev,
            studentIds: [...prev.studentIds, id]
        }));
    };

    const removeStudent = (id: string) => {
        setFormData(prev => ({
            ...prev,
            studentIds: prev.studentIds.filter(sid => sid !== id)
        }));
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 max-w-4xl">
                <Button variant="ghost" onClick={() => navigate('/classes')} className="mb-6 pl-0 hover:pl-0">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Kelas
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? "Edit Kelas" : "Buat Kelas Baru"}</CardTitle>
                        <CardDescription>
                            Atur informasi kelas dan keanggotaan mahasiswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Nama Kelas</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Biologi X-1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Mata Pelajaran</Label>
                                    <Popover open={openSubject} onOpenChange={setOpenSubject}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openSubject}
                                                className="w-full justify-between"
                                            >
                                                {formData.subjectId
                                                    ? subjects.find((s) => s.id === formData.subjectId)?.name
                                                    : "Pilih Mapel..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari mapel..." />
                                                <CommandList>
                                                    <CommandEmpty>Mapel tidak ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {subjects?.map((s) => (
                                                            <CommandItem
                                                                key={s.id}
                                                                value={s.name}
                                                                onSelect={() => {
                                                                    setFormData({ ...formData, subjectId: s.id });
                                                                    setOpenSubject(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.subjectId === s.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {s.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Dosen Pengampu</Label>
                                    <Select
                                        value={formData.teacherId}
                                        onValueChange={val => setFormData({ ...formData, teacherId: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Dosen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Dual List Box UI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
                                {/* Left Panel: Available Students */}
                                <div className="flex flex-col border rounded-lg p-4 space-y-4 overflow-hidden">
                                    <div className="flex justify-between items-center shrink-0">
                                        <Label className="text-base font-semibold">Mahasiswa Tersedia</Label>
                                        <span className="text-xs text-muted-foreground">{availableStudents.length} siswa</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="filterNoClass"
                                            checked={filterNoClass}
                                            onCheckedChange={(checked) => setFilterNoClass(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="filterNoClass"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            Belum punya kelas
                                        </label>
                                    </div>

                                    <div className="relative shrink-0">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari..."
                                            className="pl-9"
                                            value={availableSearch}
                                            onChange={(e) => setAvailableSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1 min-h-0">
                                        {availableStudents.length === 0 ? (
                                            <p className="text-center text-muted-foreground text-sm py-8">Tidak ada data</p>
                                        ) : (
                                            availableStudents.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer group"
                                                    onClick={() => addStudent(student.id)}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                                    </div>
                                                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Right Panel: Selected Students */}
                                <div className="flex flex-col border rounded-lg p-4 space-y-4 bg-muted/10 overflow-hidden">
                                    <div className="flex justify-between items-center shrink-0">
                                        <Label className="text-base font-semibold text-primary">Mahasiswa Terpilih</Label>
                                        <span className="text-xs text-muted-foreground">{selectedStudentsList.length} siswa</span>
                                    </div>
                                    <div className="relative shrink-0">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari..."
                                            className="pl-9"
                                            value={selectedSearch}
                                            onChange={(e) => setSelectedSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1 bg-background min-h-0">
                                        {selectedStudentsList.length === 0 ? (
                                            <p className="text-center text-muted-foreground text-sm py-8">Belum ada siswa dipilih</p>
                                        ) : (
                                            selectedStudentsList.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-destructive/10 cursor-pointer group"
                                                    onClick={() => removeStudent(student.id)}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                                    </div>
                                                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Check className="h-4 w-4 rotate-45" /> {/* Use X icon if available, or just rotate plus/check */}
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground text-right">* Klik pada nama mahasiswa untuk memindahkan antar tabel</p>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => navigate('/classes')}>Batal</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Menyimpan..." : "Simpan Kelas"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
