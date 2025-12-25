import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/api/apiClient';

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authApi.forgotPassword(email);
            setIsSent(true);
            toast({
                title: "Email Terkirim",
                description: "Silakan cek email Anda untuk instruksi reset password.",
            });
        } catch (err) {
            toast({
                title: "Gagal Kirim",
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
                        <CardTitle className="text-2xl text-center">Lupa Password</CardTitle>
                        <CardDescription className="text-center">
                            Masukkan email yang terdaftar untuk mereset password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSent ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">
                                    Link reset password telah dikirim ke <strong>{email}</strong>.
                                    <br />
                                    (Cek console server karena ini mode dev)
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                                    Kirim Ulang
                                </Button>
                                <Link to="/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
                                    Kembali ke Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@sekolah.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Kirim Link Reset
                                </Button>

                                <div className="text-center">
                                    <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <ArrowLeft className="mr-2 h-3 w-3" />
                                        Kembali ke Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
