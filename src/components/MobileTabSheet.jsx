import { memo, useEffect, useRef } from 'react';
import { X, Plus, Trash2, ChevronRight } from 'lucide-react';

function MobileTabSheet({ 
  isOpen, 
  onClose, 
  tabs, 
  activeTab, 
  onTabChange, 
  onAddTab, 
  onRemoveTab,
  onOpenSettings 
}) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle swipe down to close
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    
    if (diff > 100) {
      onClose();
    }
    
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl animate-slideUp max-h-[80vh] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tabs</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Tab List */}
        <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <button
                onClick={() => handleTabClick(tab.id)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activeTab === tab.id ? 'bg-primary-500' : 'bg-gray-400'
                }`} />
                <div>
                  <p className={`font-medium ${
                    activeTab === tab.id 
                      ? 'text-primary-700 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {tab.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {tab.widgets?.length || 0} Widgets
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto ${
                  activeTab === tab.id 
                    ? 'text-primary-500' 
                    : 'text-gray-400'
                }`} />
              </button>
              
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTab(tab.id);
                  }}
                  className="p-2 ml-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 safe-area-bottom">
          <button
            onClick={() => {
              onAddTab();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Neuen Tab erstellen</span>
          </button>
          
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Einstellungen
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(MobileTabSheet);
