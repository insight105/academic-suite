import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  Settings,
  FileText,
  Clock,
  Building,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: ('admin' | 'teacher' | 'student' | 'maintainer')[];
}

const navItems: NavItem[] = [
  {
    label: 'common.dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student', 'maintainer']
  },
  {
    label: 'common.quiz_bank',
    href: '/quizzes',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'maintainer']
  },
  {
    label: 'common.exam_batches',
    href: '/batches',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'maintainer']
  },
  {
    label: 'common.my_exams',
    href: '/my-exams',
    icon: <Clock className="h-5 w-5" />,
    roles: ['student', 'maintainer']
  },
  {
    label: 'common.institutions',
    href: '/institutions',
    icon: <Building className="h-5 w-5" />,
    roles: ['admin', 'maintainer']
  },
  {
    label: 'common.subjects',
    href: '/subjects',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['admin', 'maintainer']
  },
  {
    label: 'common.classes',
    href: '/classes',
    icon: <Users className="h-5 w-5" />, // Or another icon like Grid/Group
    roles: ['admin', 'teacher', 'maintainer']
  },
  {
    label: 'common.users',
    href: '/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'maintainer']
  },
  {
    label: 'common.reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'maintainer']
  },
  {
    label: 'common.history',
    href: '/history',
    icon: <FileText className="h-5 w-5" />,
    roles: ['student', 'maintainer']
  },
  {
    label: 'common.settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin', 'teacher', 'student', 'maintainer']
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">EduExam</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href ||
              location.pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{t(item.label)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        {!collapsed && user && (
          <div className="mb-3 flex justify-between items-start">
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <LanguageSwitcher />
          </div>
        )}
        {collapsed && (
          <div className="mb-3 flex justify-center">
            <LanguageSwitcher />
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>{t('common.logout')}</span>}
        </Button>
      </div>
    </aside>
  );
}
