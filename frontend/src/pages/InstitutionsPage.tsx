import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, Search, MoreHorizontal } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { institutionApi } from "@/api/apiClient";
import { Institution } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const InstitutionsPage = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user } = useAuthStore();
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        type: 'School', // Default
        email: '',
        phone: ''
    });

    useEffect(() => {
        loadInstitutions();
    }, []);

    const loadInstitutions = async () => {
        setLoading(true);
        try {
            const data = await institutionApi.getAll();
            if (user?.role === 'maintainer') {
                setInstitutions(data);
            } else if (user?.institutionId) {
                setInstitutions(data.filter(i => i.id === user.institutionId));
            } else {
                setInstitutions([]);
            }
        } catch (error) {
            console.error(error);
            toast({ title: t('common.error'), description: "Failed to load institutions", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await institutionApi.create({
                name: formData.name,
                address: formData.address,
                type: formData.type,
                contactEmail: formData.email,
                contactPhone: formData.phone
            });
            toast({ title: "Success", description: "Institution created successfully" });
            setIsDialogOpen(false);
            loadInstitutions();
            setFormData({ name: '', address: '', type: 'School', email: '', phone: '' });
        } catch (error) {
            toast({ title: "Error", description: "Failed to create institution", variant: "destructive" });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('institutions.title')}</h1>
                        <p className="text-muted-foreground mt-2">{t('institutions.subtitle')}</p>
                    </div>
                    {user?.role === 'maintainer' && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('institutions.add_institution')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('institutions.add_institution')}</DialogTitle>
                                    <DialogDescription>Enter the details of the new institution.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Institution Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Input
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            placeholder="e.g. SMA, University"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Full Address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="Contact Email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Contact Phone"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search institutions..."
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('institutions.table.name')}</TableHead>
                                <TableHead>{t('institutions.table.address')}</TableHead>
                                <TableHead>{t('institutions.table.type')}</TableHead>
                                <TableHead>{t('institutions.table.status')}</TableHead>
                                <TableHead className="w-[80px]">{t('users.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {institutions.map((inst) => (
                                <TableRow key={inst.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            {inst.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{inst.address}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {inst.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={inst.status === 'Active' ? 'outline' : 'destructive'}>
                                            {inst.status}
                                        </Badge>
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
                                                <DropdownMenuItem>{t('institutions.edit_details')}</DropdownMenuItem>
                                                <DropdownMenuItem>{t('institutions.manage_users')}</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">{t('institutions.deactivate')}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InstitutionsPage;
