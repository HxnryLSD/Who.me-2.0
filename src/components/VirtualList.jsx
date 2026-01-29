import { useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * VirtualList component for efficient rendering of large lists
 * Only renders visible items for better performance
 */
function VirtualList({
  items,
  renderItem,
  itemHeight = 50,
  className = '',
  containerHeight = 400,
  overscan = 5
}) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-gray-500 dark:text-gray-400 ${className}`}>
        Keine Einträge
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(VirtualList);
