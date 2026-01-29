import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../services/api';
import { Bookmark, ArrowLeft, Lock } from 'lucide-react';
import DashboardGrid from '../components/DashboardGrid';
import TabBar from '../components/TabBar';

function ProfilePage() {
  const { username } = useParams();
  const { getUserProfile, currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user profile
        const user = await getUserProfile(username);
        
        if (!user) {
          setError('USER_NOT_FOUND');
          setLoading(false);
          return;
        }

        setProfileUser(user);

        // Check if user is public
        if (!user.isPublic) {
          setError('PRIVATE_DASHBOARD');
          setLoading(false);
          return;
        }

        // Load dashboard data from backend
        const dashboard = await dashboardAPI.getPublicDashboard(username);
        
        if (dashboard) {
          setUserData({
            tabs: dashboard.tabs || [],
            settings: dashboard.settings || {
              background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Purple Dream' },
              gridCols: 12,
              widgetOpacity: 100
            }
          });
          
          if (dashboard.tabs && dashboard.tabs.length > 0) {
            setActiveTabId(dashboard.tabs[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        if (err.response?.status === 404) {
          setError('USER_NOT_FOUND');
        } else if (err.response?.status === 403) {
          setError('PRIVATE_DASHBOARD');
        } else {
          setError('LOAD_ERROR');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, getUserProfile]);

  // If viewing own profile and logged in, redirect to dashboard
  if (currentUser && currentUser.username === username) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Lädt...</div>
      </div>
    );
  }

  if (error === 'USER_NOT_FOUND' || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="text-center">
          <Lock className="w-16 h-16 text-white/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Benutzer nicht gefunden</h2>
          <p className="text-white/80 mb-8">Dieser Benutzer existiert nicht oder ist nicht öffentlich.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'PRIVATE_DASHBOARD') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="text-center">
          <Lock className="w-16 h-16 text-white/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Privates Dashboard</h2>
          <p className="text-white/80 mb-8">
            Dieses Dashboard ist privat und kann nicht angezeigt werden.
          </p>
          <Link
            to="/explore"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Andere Dashboards ansehen
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'LOAD_ERROR') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-white/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Fehler beim Laden</h2>
          <p className="text-white/80 mb-8">Das Dashboard konnte nicht geladen werden.</p>
          <Link
            to="/explore"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Zurück zur Entdecken-Seite
          </Link>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-white/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Dashboard nicht verfügbar</h2>
          <p className="text-white/80 mb-8">Kein Dashboard für diesen Benutzer vorhanden.</p>
          <Link
            to="/explore"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Zurück zur Entdecken-Seite
          </Link>
        </div>
      </div>
    );
  }

  const activeTab = userData?.tabs.find(tab => tab.id === activeTabId) || userData?.tabs[0];
  const backgroundStyle = userData?.settings?.background?.type === 'gradient'
    ? { background: userData.settings.background.value }
    : { backgroundColor: userData?.settings?.background?.value || '#667eea' };

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/explore" className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Zurück</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">{profileUser.displayName}</h1>
                <p className="text-sm text-white/70">@{profileUser.username}</p>
              </div>
            </div>

            <Link
              to="/register"
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Eigenes Dashboard erstellen
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {userData?.tabs && userData.tabs.length > 0 && (
        <TabBar
          tabs={userData.tabs}
          activeTab={activeTabId}
          onTabChange={setActiveTabId}
          readOnly={true}
        />
      )}

      {/* Dashboard */}
      <main className="pt-8 pb-8 px-4 max-w-[1920px] mx-auto">
        {userData?.tabs && userData.tabs.length > 0 ? (
          <DashboardGrid
            widgets={activeTab?.widgets || []}
            layouts={activeTab?.layouts || { lg: [] }}
            onLayoutChange={() => {}} // Read-only
            onRemoveWidget={() => {}} // Read-only
            onUpdateWidget={() => {}} // Read-only
            settings={userData.settings}
            readOnly={true}
          />
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-2xl mx-auto border border-white/20">
              <Bookmark className="w-16 h-16 text-white/70 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Noch keine Widgets
              </h3>
              <p className="text-white/80">
                Dieses Dashboard wurde noch nicht eingerichtet.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/60 border-t border-white/10">
        <p className="text-sm">
          Angezeigt im Gast-Modus · <Link to="/register" className="text-white hover:underline">Erstelle dein eigenes Dashboard</Link>
        </p>
      </footer>
    </div>
  );
}

export default ProfilePage;
