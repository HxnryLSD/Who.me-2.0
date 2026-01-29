import { useState } from 'react';
import { Shield, X } from 'lucide-react';

function DataSecurityNotice() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('security-notice-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('security-notice-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
              Deine Daten sind sicher
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Alle Änderungen werden automatisch in unserer Datenbank gespeichert. 
              Selbst wenn du deinen Browser-Cache löschst, bleiben deine Daten erhalten - 
              einfach neu einloggen!
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataSecurityNotice;
