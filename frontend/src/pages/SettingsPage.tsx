import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('settings.profile.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.profile.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.profile.name')}</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.profile.email')}</Label>
                  <Input id="email" defaultValue={user?.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.profile.role')}</Label>
                <Input value={user?.role?.toUpperCase()} disabled />
              </div>
              <Button>{t('settings.profile.save')}</Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings.security.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.security.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t('settings.security.current_password')}</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('settings.security.new_password')}</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('settings.security.confirm_password')}</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Button>{t('settings.security.change_password')}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Preferences Section */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.notifications.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.notifications.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.notifications.email.label')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.notifications.email.desc')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.notifications.schedule.label')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.notifications.schedule.desc')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.notifications.results.label')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.notifications.results.desc')}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                {t('settings.appearance.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.appearance.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('settings.appearance.dark_mode.label')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.appearance.dark_mode.desc')}
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
