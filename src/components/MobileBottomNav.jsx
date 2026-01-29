import { memo } from 'react';
import { 
  Home, 
  Plus, 
  Settings, 
  Layers, 
  Moon, 
  Sun,
  Download,
  Upload,
  LogOut
} from 'lucide-react';

function MobileBottomNav({ 
  theme,
  toggleTheme,
  onAddWidget, 
  onOpenSettings,
  onExport,
  onImport,
  onLogout,
  onShowTabs,
  currentUser
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Tabs */}
        <button
          onClick={onShowTabs}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[56px]"
        >
          <Layers className="w-5 h-5" />
          <span className="text-xs mt-1">Tabs</span>
        </button>

        {/* Add Widget */}
        <button
          onClick={onAddWidget}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[56px]"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs mt-1">Neu</span>
        </button>

        {/* Center Action Button - Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all active:scale-95"
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>

        {/* Export/Import */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 min-w-[56px]">
          <div className="flex gap-1">
            <button
              onClick={onExport}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Exportieren"
            >
              <Download className="w-4 h-4" />
            </button>
            <label className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json,.html"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>
          <span className="text-xs mt-0.5">Daten</span>
        </div>

        {/* Settings / Logout */}
        <button
          onClick={currentUser ? onLogout : onOpenSettings}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[56px]"
        >
          {currentUser ? (
            <>
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1 text-red-500">Logout</span>
            </>
          ) : (
            <>
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Mehr</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

export default memo(MobileBottomNav);
