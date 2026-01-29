import { useMemo, memo, useCallback, useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import WidgetWrapper from './WidgetWrapper';
import WidgetRenderer from './widgets/WidgetRenderer';
import { GRID_COLS, GRID_ROW_HEIGHT } from '../utils/constants';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Responsive column configuration for different screen sizes
const getResponsiveCols = (baseCols) => ({
  lg: baseCols,           // Desktop: full columns
  md: Math.min(baseCols, 8),  // Tablet landscape: max 8 cols
  sm: Math.min(baseCols, 6),  // Tablet portrait: max 6 cols
  xs: Math.min(baseCols, 4),  // Mobile landscape: max 4 cols
  xxs: 2                      // Mobile portrait: 2 cols
});

function DashboardGrid({ 
  widgets, 
  layouts, 
  onLayoutChange, 
  onRemoveWidget,
  onUpdateWidget,
  settings,
  readOnly = false
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Detect device type for touch-optimized interactions
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  const baseCols = settings.gridCols || GRID_COLS;
  const responsiveCols = useMemo(() => getResponsiveCols(baseCols), [baseCols]);

  const gridLayout = useMemo(() => {
    return widgets.map((widget) => {
      const layoutItem = layouts.lg?.find(l => l.i === widget.id);
      const baseW = layoutItem?.w || 2;
      const baseH = layoutItem?.h || 2;
      
      return {
        i: widget.id,
        x: layoutItem?.x || 0,
        y: layoutItem?.y || 0,
        w: baseW,
        h: baseH,
        minW: layoutItem?.minW || 1,
        minH: layoutItem?.minH || 1
      };
    });
  }, [widgets, layouts]);

  const handleRemove = useCallback((widgetId) => {
    onRemoveWidget(widgetId);
  }, [onRemoveWidget]);

  // Adjust row height for different devices
  const rowHeight = useMemo(() => {
    if (isMobile) return GRID_ROW_HEIGHT * 0.9;
    if (isTablet) return GRID_ROW_HEIGHT * 0.95;
    return GRID_ROW_HEIGHT;
  }, [isMobile, isTablet]);

  // Adjust margins for different devices
  const margin = useMemo(() => {
    if (isMobile) return [8, 8];
    if (isTablet) return [12, 12];
    return [16, 16];
  }, [isMobile, isTablet]);

  return (
    <div className="pb-8 overflow-x-auto md:overflow-x-visible mobile-scroll">
      <div className="min-w-[320px] md:min-w-0">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: gridLayout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={responsiveCols}
          rowHeight={rowHeight}
          onLayoutChange={(layout, layouts) => onLayoutChange(layouts)}
          isDraggable={!readOnly && !isMobile}
          isResizable={!readOnly && !isMobile}
          draggableHandle=".widget-drag-handle"
          margin={margin}
          containerPadding={isMobile ? [8, 8] : [16, 16]}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
        {widgets.map((widget) => (
          <div 
            key={widget.id}
            style={{ 
              opacity: (settings.widgetOpacity || 100) / 100
            }}
            className={isMobile ? 'touch-manipulation' : ''}
          >
            <WidgetWrapper
              title={widget.title}
              onRemove={readOnly ? undefined : () => handleRemove(widget.id)}
              readOnly={readOnly}
              shadowLevel={settings.shadowLevel}
              glassEffect={settings.glassEffect}
              isMobile={isMobile}
            >
              <WidgetRenderer 
                widget={widget}
                onUpdate={readOnly ? () => {} : onUpdateWidget}
                readOnly={readOnly}
              />
            </WidgetWrapper>
          </div>
        ))}
      </ResponsiveGridLayout>
      </div>
      
      {widgets.length === 0 && (
        <div className="text-center py-12 md:py-20 px-4">
          <p className="text-gray-400 dark:text-gray-500 text-base md:text-lg mb-2">
            Keine Widgets vorhanden
          </p>
          {!readOnly && (
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {isMobile 
                ? 'Tippe unten auf "Neu" um ein Widget hinzuzufügen'
                : 'Klicke auf das + Icon oben, um dein erstes Widget hinzuzufügen'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(DashboardGrid);
