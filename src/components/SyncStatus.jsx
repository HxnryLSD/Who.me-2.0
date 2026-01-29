import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useSync } from '../contexts/SyncContext';

function SyncStatus() {
  const { isConnected, isSyncing, lastSyncAt } = useSync();

  const formatLastSync = () => {
    if (!lastSyncAt) return 'Nie';
    
    const now = new Date();
    const diff = now - lastSyncAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'Gerade eben';
    if (minutes < 60) return `Vor ${minutes} Min`;
    if (hours < 24) return `Vor ${hours} Std`;
    return lastSyncAt.toLocaleDateString();
  };

  // Nur anzeigen wenn synchronisiert wird oder verbunden ist
  if (!isConnected && !isSyncing) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isConnected ? (
        <>
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-blue-600 dark:text-primary-400">Synchronisiere...</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400 hidden sm:inline">Verbunden</span>
              {lastSyncAt && (
                <>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <Clock className="w-4 h-4 text-gray-400 hidden sm:inline" />
                  <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">{formatLastSync()}</span>
                </>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default SyncStatus;
