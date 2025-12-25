import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Shield,
  Clock,
  Users,
  BarChart3,
  Zap,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Clock,
      title: 'Timer Server-Based',
      description: 'Waktu ujian dihitung 100% dari server, tidak bisa dimanipulasi oleh peserta.'
    },
    {
      icon: Shield,
      title: 'Freeze & Resume',
      description: 'Handle gangguan massal dengan aman. Timer berhenti untuk semua peserta sekaligus.'
    },
    {
      icon: Zap,
      title: 'Autosave Lokal',
      description: 'Jawaban tersimpan di local terenkripsi, aman dari browser crash.'
    },
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Sistem role lengkap untuk Admin, Guru/Dosen, dan Siswa/Mahasiswa.'
    },
    {
      icon: BarChart3,
      title: 'Audit Trail',
      description: 'Setiap aksi tercatat lengkap. Submit, expire, freeze, resume, semua terlacak.'
    },
    {
      icon: BookOpen,
      title: 'Exam Batch System',
      description: 'Satu quiz bisa digunakan berkali-kali. Ujian susulan tanpa duplikasi soal.'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '< 100ms', label: 'Response Time' },
    { value: '50K+', label: 'Concurrent Users' },
    { value: '256-bit', label: 'Encryption' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">EduExam Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </a>
          </nav>
          <Link to="/login">
            <Button>
              Masuk
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Sistem Ujian Berstandar Integritas Akademik
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Platform Quiz & Ujian Online untuk{' '}
              <span className="text-primary">Institusi Pendidikan</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sistem ujian modern dengan keamanan tinggi, timer server-based,
              freeze/resume untuk gangguan massal, dan audit trail lengkap.
              Siap dipakai dari SMA hingga Universitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Sekarang
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Pelajari Fitur
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dibangun dengan fokus pada keadilan akademik, performa tinggi, dan auditability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Bagaimana Sistem Bekerja?
              </h2>
              <p className="text-muted-foreground mb-8">
                EduExam Pro dirancang dengan konsep <strong>Exam Batch</strong> -
                memisahkan konten quiz dari pelaksanaan ujian. Satu quiz bisa digunakan
                berkali-kali tanpa duplikasi soal.
              </p>
              <ul className="space-y-4">
                {[
                  'Quiz berisi bank soal yang tidak berubah',
                  'Exam Batch adalah pelaksanaan ujian dengan jadwal tertentu',
                  'Ujian susulan dibuat sebagai batch baru, bukan quiz baru',
                  '1 siswa hanya boleh 1 attempt per batch',
                  'Semua attempt tercatat dan tidak bisa dihapus'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Buat Quiz</h4>
                    <p className="text-sm text-muted-foreground">Guru membuat bank soal</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border ml-5" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Jadwalkan Batch</h4>
                    <p className="text-sm text-muted-foreground">Tentukan waktu & peserta</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border ml-5" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Siswa Mengerjakan</h4>
                    <p className="text-sm text-muted-foreground">Dengan timer server-based</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border ml-5" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-chart-2 flex items-center justify-center text-primary-foreground font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Laporan Otomatis</h4>
                    <p className="text-sm text-muted-foreground">Nilai & audit trail lengkap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Siap Memulai?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Tingkatkan integritas ujian di institusi Anda dengan EduExam Pro
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Masuk Sekarang
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">EduExam Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 EduExam Pro. Platform Ujian Online untuk Pendidikan.
          </p>
        </div>
      </footer>
    </div>
  );
}
