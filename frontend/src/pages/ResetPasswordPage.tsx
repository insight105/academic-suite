import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/api/apiClient';

export default function ResetPasswordPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="w-full max-w-md text-center p-6">
                    <h2 className="text-xl font-bold mb-2">Link Tidak Valid</h2>
                    <p className="text-muted-foreground mb-4">Token reset password tidak ditemukan.</p>
                    <Link to="/login">
                        <Button>Kembali ke Login</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Password tidak sama",
                description: "Pastikan password konfirmasi sesuai.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(token, password);
            toast({
                title: "Berhasil",
                description: "Password berhasil diubah. Silakan login.",
            });
            navigate('/login');
        } catch (err) {
            toast({
                title: "Gagal Reset",
                description: err instanceof Error ? err.message : 'Terjadi kesalahan',
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">EduExam Pro</span>
                </div>

                <Card className="border-border shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Masukkan password baru untuk akun Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11"
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ubah Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
