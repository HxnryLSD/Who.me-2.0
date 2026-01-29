import { memo } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';

function PullToRefreshIndicator({ pullDistance, pullProgress, isRefreshing, shouldTrigger }) {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 flex justify-center z-[100] pointer-events-none md:hidden"
      style={{ 
        transform: `translateY(${Math.min(pullDistance, 80)}px)`,
        opacity: pullProgress
      }}
    >
      <div className={`
        flex items-center justify-center w-12 h-12 -mt-12 rounded-full 
        bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
        transition-transform duration-200
        ${shouldTrigger || isRefreshing ? 'scale-110' : 'scale-100'}
      `}>
        {isRefreshing ? (
          <RefreshCw className="w-5 h-5 text-primary-600 animate-spin" />
        ) : shouldTrigger ? (
          <RefreshCw 
            className="w-5 h-5 text-primary-600" 
            style={{ transform: `rotate(${pullProgress * 180}deg)` }}
          />
        ) : (
          <ArrowDown 
            className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform" 
            style={{ transform: `rotate(${pullProgress * 180}deg)` }}
          />
        )}
      </div>
    </div>
  );
}

export default memo(PullToRefreshIndicator);
