import { memo } from 'react';
import { X, GripVertical } from 'lucide-react';

function WidgetWrapper({ 
  children, 
  onRemove, 
  title, 
  readOnly = false, 
  shadowLevel = 'lg', 
  glassEffect = false,
  isMobile = false 
}) {
  const shadowClass = {
    'sm': 'shadow-sm-custom',
    'md': 'shadow-md-custom',
    'lg': 'shadow-lg-custom',
    'xl': 'shadow-xl-custom',
    '2xl': 'shadow-2xl-custom'
  }[shadowLevel] || 'shadow-lg';

  return (
    <div className={`h-full rounded-xl border overflow-hidden flex flex-col transition-all duration-300 ${
      !isMobile ? 'hover-lift' : ''
    } ${
      glassEffect 
        ? 'glassmorphism' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    } ${shadowClass}`}>
      <div className={`widget-drag-handle flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b transition-colors ${
        glassEffect
          ? 'border-white/20 dark:border-white/10 bg-white/5'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
      } ${readOnly ? 'cursor-default' : 'cursor-move hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
        {/* Mobile: Show grip icon for better UX indication */}
        {!readOnly && !isMobile && (
          <GripVertical className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 hidden md:block" />
        )}
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate flex-1">
          {title}
        </h3>
        {!readOnly && onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 md:p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover-scale flex-shrink-0 group touch-target"
            title="Widget entfernen"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 md:p-4 mobile-scroll">
        {children}
      </div>
    </div>
  );
}

export default memo(WidgetWrapper);
