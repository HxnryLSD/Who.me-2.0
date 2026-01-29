import { memo } from 'react';
import { Plus, X } from 'lucide-react';

function TabBar({ tabs, activeTab, onTabChange, onAddTab, onRemoveTab, readOnly = false }) {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="group flex items-center space-x-2 relative flex-shrink-0"
            >
              <button
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.name}
              </button>
              {!readOnly && tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"
                  title="Tab entfernen"
                >
                  <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          ))}
          
          {!readOnly && (
            <button
              onClick={onAddTab}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2 flex-shrink-0"
              title="Tab hinzufügen"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(TabBar);
