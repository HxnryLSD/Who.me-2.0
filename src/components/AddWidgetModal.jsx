import { useState } from 'react';
import { X, Bookmark, CheckSquare, StickyNote, Clock, CloudSun, Rss } from 'lucide-react';
import { WIDGET_TYPES } from '../utils/constants';

const WIDGET_OPTIONS = [
  { type: WIDGET_TYPES.BOOKMARK_LIST, label: 'Lesezeichen-Liste', Icon: Bookmark },
  { type: WIDGET_TYPES.TODO, label: 'Aufgabenliste', Icon: CheckSquare },
  { type: WIDGET_TYPES.NOTE, label: 'Notiz', Icon: StickyNote },
  { type: WIDGET_TYPES.CLOCK, label: 'Uhr', Icon: Clock },
  { type: WIDGET_TYPES.WEATHER, label: 'Wetter', Icon: CloudSun },
  { type: WIDGET_TYPES.RSS, label: 'RSS-Feed', Icon: Rss },
];

export default function AddWidgetModal({ isOpen, onClose, onAddWidget }) {
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState('');
  const [config, setConfig] = useState({});

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!selectedType || !title.trim()) return;

    onAddWidget({
      type: selectedType,
      title,
      data: config
    });

    setSelectedType(null);
    setTitle('');
    setConfig({});
    onClose();
  };

  const renderConfigFields = () => {
    switch (selectedType) {
      case WIDGET_TYPES.WEATHER:
        return (
          <input
            type="text"
            value={config.city || ''}
            onChange={(e) => setConfig({ ...config, city: e.target.value })}
            placeholder="Stadt (z.B. Berlin)"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );
      case WIDGET_TYPES.RSS:
        return (
          <input
            type="text"
            value={config.feedUrl || ''}
            onChange={(e) => setConfig({ ...config, feedUrl: e.target.value })}
            placeholder="RSS-Feed URL"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        );
      case WIDGET_TYPES.CLOCK:
        return (
          <select
            value={config.timezone || 'Europe/Berlin'}
            onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="Europe/Berlin">Berlin</option>
            <option value="Europe/London">London</option>
            <option value="America/New_York">New York</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Widget hinzufügen
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Widget-Typ auswählen
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {WIDGET_OPTIONS.map((option) => {
                const IconComponent = option.Icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === option.type
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <IconComponent className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Widget-Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel eingeben..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {renderConfigFields() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Konfiguration
                  </label>
                  {renderConfigFields()}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedType || !title.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
