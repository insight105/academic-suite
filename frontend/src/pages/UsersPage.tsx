import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { UserPlus, MoreHorizontal, Search, Loader2, FileUp } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { userApi, institutionApi } from '@/api/apiClient';
import { User, Institution } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { ImportUserDialog } from '@/components/users/ImportUserDialog';

const UsersPage = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { user: currentUser } = useAuthStore();

    // Data State
    const [users, setUsers] = useState<User[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

    // Filter State
    const [search, setSearch] = useState("");
    const [institutionFilter, setInstitutionFilter] = useState("");

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        institutionId: ""
    });

    useEffect(() => {
        fetchInstitutions();
    }, []);

    useEffect(() => {
        // Only fetch if search is empty (reset) or >= 3 chars
        if (search.length === 0 || search.length >= 3) {
            fetchUsers();
        }
    }, [meta.page, search, institutionFilter]);

    // If current user is from an institution, force filter (optional logic)
    // If current user is from an institution, force filter (optional logic)
    useEffect(() => {
        if (currentUser?.institutionId && currentUser.role !== 'maintainer') {
            setInstitutionFilter(currentUser.institutionId);
        }
    }, [currentUser]);

    const fetchInstitutions = async () => {
        try {
            const data = await institutionApi.getAll();
            setInstitutions(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userApi.getAll({
                page: meta.page,
                limit: meta.limit,
                search,
                institutionId: institutionFilter
            });
            setUsers(res.data || []);
            setMeta(prev => ({ ...prev, ...res.meta }));
        } catch (error) {
            toast({ title: t('users.toast.load_fail'), description: String(error), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setMeta(prev => ({ ...prev, page: 1 })); // Reset to page 1
        fetchUsers();
    };

    const openCreateDialog = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "student",
            institutionId: currentUser?.institutionId || ""
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        if (currentUser?.role !== 'maintainer' && currentUser?.role !== 'admin' && currentUser?.id !== user.id) {
            toast({ title: t('common.error'), description: "Unauthorized", variant: "destructive" });
            return;
        }
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "", // Leave blank if not changing
            role: user.role,
            institutionId: user.institutionId
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userApi.update(editingUser.id, {
                    name: formData.name,
                    role: formData.role as any,
                    institutionId: formData.institutionId
                });
                toast({ title: t('users.toast.update_success') });
            } else {
                await userApi.create({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role as any,
                    institutionId: formData.institutionId
                });
                toast({ title: t('users.toast.create_success') });
            }
            setIsDialogOpen(false);
            fetchUsers();
        } catch (error) {
            toast({ title: t('users.toast.op_fail'), description: String(error), variant: "destructive" });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 container mx-auto p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
                        <p className="text-muted-foreground mt-2">{t('users.subtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                            <FileUp className="mr-2 h-4 w-4" />
                            {t('users.import_excel')}
                        </Button>
                        <Button onClick={openCreateDialog}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t('users.add_user')}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={t('users.filter_institution')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">{t('users.all_institutions')}</SelectItem>
                            {institutions.map(inst => (
                                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('users.table.name')}</TableHead>
                                <TableHead>{t('users.table.email')}</TableHead>
                                <TableHead>{t('users.table.institution')}</TableHead>
                                <TableHead>{t('users.table.role')}</TableHead>
                                <TableHead>{t('users.table.joined')}</TableHead>
                                <TableHead className="w-[80px]">{t('users.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        {t('users.no_users')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {institutions.find(i => i.id === user.institutionId)?.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'teacher' ? 'secondary' : 'outline'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('users.table.actions')}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                        {t('users.edit_user')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page {meta.page} of {meta.totalPages} ({meta.total} users)
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={meta.page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMeta(prev => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
                        disabled={meta.page >= meta.totalPages}
                    >
                        Next
                    </Button>
                </div>

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? t('users.edit_user') : t('users.create_user')}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? t('users.edit_desc') : t('users.create_desc')}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">{t('users.table.name')}</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">{t('users.table.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="col-span-3"
                                    disabled={!!editingUser} // Disable email edit for simplicity
                                    required
                                />
                            </div>
                            {!editingUser && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="col-span-3"
                                        required={!editingUser}
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">{t('users.table.role')}</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="maintainer">Maintainer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="institution" className="text-right">{t('users.table.institution')}</Label>
                                <Select
                                    value={formData.institutionId}
                                    onValueChange={(val) => setFormData({ ...formData, institutionId: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select institution" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutions.map(inst => (
                                            <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="submit">{t('subjects.save_changes')}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Import Dialog */}
                <ImportUserDialog
                    open={isImportDialogOpen}
                    onOpenChange={setIsImportDialogOpen}
                    onSuccess={() => {
                        fetchUsers();
                    }}
                />
            </div >
        </DashboardLayout >
    );
};

export default UsersPage;
