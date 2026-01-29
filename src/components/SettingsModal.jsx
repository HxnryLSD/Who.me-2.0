import { X, Palette, Globe, Lock, Grid3x3, Eye, Sparkles, Type } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PRESET_BACKGROUNDS = [
  { type: 'color', value: '#121212', label: 'True Black' },
  { type: 'color', value: '#1e1e1e', label: 'Dark Gray' },
  { type: 'color', value: '#2a2a2a', label: 'Charcoal' },
  { type: 'color', value: '#f8fafc', label: 'Light Gray' },
  { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Purple Dream' },
  { type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Pink Sunset' },
  { type: 'gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Blue Sky' },
  { type: 'gradient', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Green Ocean' },
  { type: 'gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', label: 'Sunrise' },
  { type: 'gradient', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', label: 'Ocean Depths' },
  { type: 'gradient', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', label: 'Pastel Dream' },
  { type: 'gradient', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', label: 'Warm Sunset' },
  { type: 'gradient', value: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', label: 'Fresh Lime' },
  { type: 'gradient', value: 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)', label: 'Deep Blue' },
];

const FONT_OPTIONS = [
  { value: 'font-inter', label: 'Inter', family: 'Inter' },
  { value: 'font-roboto', label: 'Roboto', family: 'Roboto' },
  { value: 'font-open-sans', label: 'Open Sans', family: 'Open Sans' },
  { value: 'font-lato', label: 'Lato', family: 'Lato' },
  { value: 'font-poppins', label: 'Poppins', family: 'Poppins' },
  { value: 'font-montserrat', label: 'Montserrat', family: 'Montserrat' },
  { value: 'font-raleway', label: 'Raleway', family: 'Raleway' },
  { value: 'font-playfair', label: 'Playfair Display', family: 'Playfair Display' },
  { value: 'font-merriweather', label: 'Merriweather', family: 'Merriweather' },
  { value: 'font-fira-code', label: 'Fira Code', family: 'Fira Code' },
];

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
  const { currentUser, updateUserProfile } = useAuth();

  if (!isOpen) return null;

  const handleBackgroundChange = (background) => {
    onUpdateSettings({ ...settings, background });
  };

  const handlePrivacyToggle = () => {
    if (currentUser) {
      updateUserProfile({ isPublic: !currentUser.isPublic });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Einstellungen
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Palette className="w-5 h-5" />
              <span>Hintergrund</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_BACKGROUNDS.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => handleBackgroundChange(bg)}
                  className={`aspect-video rounded-lg border-2 transition-all overflow-hidden hover-lift ${
                    settings.background?.value === bg.value
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                  style={{
                    background: bg.value
                  }}
                  title={bg.label}
                >
                  <span className="sr-only">{bg.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                Eigene Farbe
              </label>
              <input
                type="color"
                value={settings.background?.type === 'color' ? settings.background.value : '#ffffff'}
                onChange={(e) => handleBackgroundChange({ type: 'color', value: e.target.value, label: 'Eigene Farbe' })}
                className="w-full h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Grid-Spalten
            </label>
            <input
              type="range"
              min="6"
              max="10"
              step="1"
              value={settings.gridCols || 10}
              onChange={(e) => onUpdateSettings({ ...settings, gridCols: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {settings.gridCols || 10} Spalten
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Auf Mobilgeräten kannst du horizontal swipen, um alle Spalten zu sehen
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Widget-Transparenz
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={settings.widgetOpacity || 100}
              onChange={(e) => onUpdateSettings({ ...settings, widgetOpacity: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {settings.widgetOpacity || 100}%
            </div>
          </div>

          {/* Widget Shadow */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Eye className="w-5 h-5" />
              <span>Widget-Schatten</span>
            </label>
            <select
              value={settings.shadowLevel || 'lg'}
              onChange={(e) => onUpdateSettings({ ...settings, shadowLevel: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="sm">Klein</option>
              <option value="md">Mittel</option>
              <option value="lg">Groß</option>
              <option value="xl">Sehr Groß</option>
              <option value="2xl">Extra Groß</option>
            </select>
          </div>

          {/* Grid Lines */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Grid3x3 className="w-5 h-5" />
              <span>Grid-Linien anzeigen</span>
            </label>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hilfslinien im Bearbeitungsmodus
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showGridLines || false}
                  onChange={(e) => onUpdateSettings({ ...settings, showGridLines: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Glassmorphism */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Sparkles className="w-5 h-5" />
              <span>Glassmorphism-Effekt</span>
            </label>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Durchsichtiger Glas-Effekt für Widgets
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.glassEffect || false}
                  onChange={(e) => onUpdateSettings({ ...settings, glassEffect: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Type className="w-5 h-5" />
              <span>Schriftart</span>
            </label>
            <select
              value={settings.fontFamily || 'font-inter'}
              onChange={(e) => onUpdateSettings({ ...settings, fontFamily: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.family }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Die Schriftart wird auf das gesamte Dashboard angewendet
            </p>
          </div>

          {/* Privacy Settings */}
          {currentUser && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                <Globe className="w-5 h-5" />
                <span>Datenschutz & Sichtbarkeit</span>
              </label>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {currentUser.isPublic ? (
                        <Globe className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-600" />
                      )}
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {currentUser.isPublic ? 'Öffentliches Dashboard' : 'Privates Dashboard'}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentUser.isPublic
                        ? 'Dein Dashboard kann von anderen als Gast besucht werden.'
                        : 'Nur du kannst dein Dashboard sehen. Andere können es nicht besuchen.'
                      }
                    </p>
                    {currentUser.isPublic && (
                      <p className="text-sm text-purple-600 dark:text-primary-400 mt-2">
                        Dein Profil-Link: {window.location.origin}/profile/{currentUser.username}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handlePrivacyToggle}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentUser.isPublic
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {currentUser.isPublic ? 'Privat machen' : 'Öffentlich machen'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
