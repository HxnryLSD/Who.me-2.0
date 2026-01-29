import { memo } from 'react';
import { Moon, Sun, Settings, Plus, Download, Upload, LogOut, User, Save, Check } from 'lucide-react';
import SyncStatus from './SyncStatus';

function Header({ 
  theme, 
  toggleTheme, 
  onAddWidget, 
  onOpenSettings,
  onExport,
  onImport,
  onLogout,
  currentUser,
  saving
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Who.Me
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              Deine persönliche Kommandozentrale
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <SyncStatus />
            
            {saving && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mr-2">
                <Save className="w-4 h-4 animate-pulse" />
                <span>Speichert...</span>
              </div>
            )}
            
            <button
              onClick={onAddWidget}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Widget hinzufügen"
            >
              <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <button
              onClick={onExport}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Exportieren"
            >
              <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <label className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <input
                type="file"
                accept=".json,.html"
                onChange={onImport}
                className="hidden"
                title="Importieren"
              />
            </label>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Theme wechseln"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Einstellungen"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {currentUser && (
              <>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {currentUser.displayName || currentUser.username}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Abmelden"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
