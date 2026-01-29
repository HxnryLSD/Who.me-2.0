import { Link } from 'react-router-dom';
import { Bookmark, Layout, Globe, Lock, Palette, Zap, Users, CheckCircle, CheckSquare, StickyNote, Clock, CloudSun, Rss, Plus } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Who.Me</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-white hover:text-gray-200 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Registrieren
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Deine Perfekte Startseite
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Organisiere deine Bookmarks, Notizen und Todos in einem anpassbaren Dashboard.
          Drag & Drop, Themes und vieles mehr.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            Jetzt Starten - Kostenlos
          </Link>
          <Link
            to="/explore"
            className="px-8 py-4 bg-purple-500/30 backdrop-blur-sm text-white rounded-lg hover:bg-purple-500/40 transition-all font-bold text-lg border-2 border-white/30"
          >
            Öffentliche Dashboards
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">
          Was bieten wir?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Layout className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Drag & Drop</h4>
            <p className="text-white/80">
              Organisiere deine Widgets per Drag & Drop. Größe und Position anpassbar.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Bookmark className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Bookmarks</h4>
            <p className="text-white/80">
              Speichere und organisiere deine Lieblings-Websites mit automatischen Favicons.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <CheckCircle className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Todos & Notizen</h4>
            <p className="text-white/80">
              Verwalte deine Aufgaben und Notizen direkt in deinem Dashboard.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Palette className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Themes</h4>
            <p className="text-white/80">
              Wähle aus verschiedenen Farbverläufen und passe die Transparenz an.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Globe className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Öffentliche Profile</h4>
            <p className="text-white/80">
              Teile dein Dashboard mit anderen oder besuche öffentliche Dashboards als Gast.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Lock className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Privacy</h4>
            <p className="text-white/80">
              Entscheide selbst, ob dein Dashboard öffentlich oder privat sein soll.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Zap className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Performance</h4>
            <p className="text-white/80">
              Optimiert für schnelle Ladezeiten und flüssige Animationen.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <Users className="w-12 h-12 text-white mb-4" />
            <h4 className="text-2xl font-bold text-white mb-3">Tabs</h4>
            <p className="text-white/80">
              Erstelle mehrere Tabs für unterschiedliche Kontexte (Arbeit, Privat, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* Widget Showcase */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-12">
          Widget-Typen
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <Bookmark className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Bookmark List</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <CheckSquare className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Todo List</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <StickyNote className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Sticky Notes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Clock</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <CloudSun className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Weather</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <Rss className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">RSS Feed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <Bookmark className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Bookmark</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col items-center gap-3">
            <Plus className="w-8 h-8 text-white" />
            <p className="text-white font-semibold">Mehr bald...</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
          <h3 className="text-4xl font-bold text-white mb-6">
            Bereit loszulegen?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Erstelle dein kostenloses Konto und gestalte deine perfekte Startseite in Minuten.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            Kostenlos Registrieren
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/60 border-t border-white/10">
        <p>© 2026 Who.Me - Deine Perfekte Startseite</p>
      </footer>
    </div>
  );
}

export default LandingPage;
