import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      toast({
        title: t('login.form.success_title'),
        description: t('login.form.success_desc')
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: t('login.form.fail_title'),
        description: err instanceof Error ? err.message : t('login.form.error_default'),
        variant: "destructive"
      });
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@eduexam.com', password: 'admin123' },
    { role: 'Guru', email: 'guru@eduexam.com', password: 'guru123' },
    { role: 'Siswa', email: 'siswa@eduexam.com', password: 'siswa123' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">EduExam Pro</span>
          </div>

          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            {t('login.hero.title')}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            {t('login.hero.desc')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">✓</span>
            </div>
            <div>
              <h3 className="text-primary-foreground font-medium">{t('login.hero.feature_timer')}</h3>
              <p className="text-primary-foreground/70 text-sm">{t('login.hero.feature_timer_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">✓</span>
            </div>
            <div>
              <h3 className="text-primary-foreground font-medium">{t('login.hero.feature_freeze')}</h3>
              <p className="text-primary-foreground/70 text-sm">{t('login.hero.feature_freeze_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">✓</span>
            </div>
            <div>
              <h3 className="text-primary-foreground font-medium">{t('login.hero.feature_autosave')}</h3>
              <p className="text-primary-foreground/70 text-sm">{t('login.hero.feature_autosave_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduExam Pro</span>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('login.form.title')}</CardTitle>
              <CardDescription className="text-center">
                {t('login.form.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.form.email')}</Label>
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('login.form.password')}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t('login.form.forgot_password')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
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

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('login.form.submit')}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  {t('login.form.demo_accounts')}
                </p>
                <div className="space-y-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                      }}
                      className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-foreground">{account.role}</span>
                        <span className="text-xs text-muted-foreground">{account.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
