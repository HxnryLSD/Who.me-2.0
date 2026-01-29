import { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';

function ConflictResolutionModal({ conflict, onResolve, onClose }) {
  const [resolution, setResolution] = useState('server');

  if (!conflict) return null;

  const handleResolve = () => {
    const data = {
      local: conflict.localData,
      server: conflict.serverData,
      merged: resolution === 'server' ? conflict.serverData : conflict.localData
    };

    onResolve(resolution, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sync-Konflikt erkannt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ihr Dashboard wurde auf einem anderen Gerät geändert. Bitte wählen Sie, welche Version Sie behalten möchten:
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-medium mb-1">Versionkonflikt</p>
                  <p>Lokale Version: {conflict.localVersion} | Server Version: {conflict.serverVersion}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Server Version */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              resolution === 'server'
                ? 'border-primary-500 bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resolution"
                  value="server"
                  checked={resolution === 'server'}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      Server-Version verwenden
                    </h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 px-2 py-1 rounded">
                      Empfohlen
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Die neueste Version vom Server übernehmen. Ihre lokalen Änderungen gehen verloren.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {conflict.serverData.tabs?.length || 0} Tabs
                  </div>
                </div>
              </div>
            </label>

            {/* Local Version */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              resolution === 'local'
                ? 'border-primary-500 bg-gray-50 dark:bg-gray-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="resolution"
                  value="local"
                  checked={resolution === 'local'}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                    Lokale Version verwenden
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Ihre lokalen Änderungen auf dem Server speichern. Änderungen von anderen Geräten gehen verloren.
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {conflict.localData.tabs?.length || 0} Tabs
                  </div>
                </div>
              </div>
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleResolve}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Check className="w-5 h-5" />
              Konflikt auflösen
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConflictResolutionModal;
