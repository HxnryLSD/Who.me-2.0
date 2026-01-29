import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Bookmark, ArrowRight } from 'lucide-react';

function ExplorePage() {
  const { getPublicUsers } = useAuth();
  const [publicUsers, setPublicUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getPublicUsers();
        setPublicUsers(users);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [getPublicUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Who.Me</h1>
          </Link>
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

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-white" />
            <h2 className="text-4xl font-bold text-white">Öffentliche Dashboards</h2>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Entdecke wie andere ihre Startseite organisieren und lass dich inspirieren
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-white text-xl">Lädt...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {publicUsers.map(user => (
              <Link
                key={user.id}
                to={`/profile/${user.username}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {user.displayName}
                    </h3>
                    <p className="text-white/70">@{user.username}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Bookmark className="w-4 h-4" />
                  <span>Dashboard ansehen</span>
                </div>
              </Link>
            ))}

            {publicUsers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 text-lg">
                  Noch keine öffentlichen Dashboards verfügbar
                </p>
              </div>
            )}
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Erstelle dein eigenes Dashboard
            </h3>
            <p className="text-white/90 mb-6">
              Registriere dich kostenlos und gestalte deine perfekte Startseite
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-bold shadow-xl"
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ExplorePage;
