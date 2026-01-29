import { useState, useCallback, lazy, Suspense, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import { useTheme } from '../hooks/useLocalStorage';
import usePullToRefresh from '../hooks/usePullToRefresh';
import { useSwipeNavigation } from '../hooks/useTouchGestures';
import { dashboardAPI } from '../services/api';
import { generateId, exportToJSON, importFromJSON, parseHTMLBookmarks } from '../utils/helpers';
import { DEFAULT_TABS, DEFAULT_WIDGET_SIZES } from '../utils/constants';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import DashboardGrid from '../components/DashboardGrid';
import DataSecurityNotice from '../components/DataSecurityNotice';
import MobileScrollHint from '../components/MobileScrollHint';
import MobileBottomNav from '../components/MobileBottomNav';
import MobileTabSheet from '../components/MobileTabSheet';
import PullToRefreshIndicator from '../components/PullToRefreshIndicator';
import ConflictResolutionModal from '../components/ConflictResolutionModal';

const AddWidgetModal = lazy(() => import('../components/AddWidgetModal'));
const SettingsModal = lazy(() => import('../components/SettingsModal'));

function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, setTheme: setLocalTheme } = useTheme();
  const { syncDashboard, syncConflict, resolveConflict } = useSync();
  
  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TABS[0]?.id);
  const [dashboardVersion, setDashboardVersion] = useState(1);
  const [settings, setSettings] = useState({
    background: { type: 'color', value: '#1e1e1e', label: 'Dark Gray' },
    gridCols: 10,
    widgetOpacity: 100,
    theme: 'light'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileTabSheet, setShowMobileTabSheet] = useState(false);
  
  // Track previous values to detect changes
  const prevTabsRef = useRef(null);
  const prevSettingsRef = useRef(null);
  
  // Mobile: Swipe navigation between tabs
  const { bind: swipeBind } = useSwipeNavigation(tabs, activeTabId, setActiveTabId);
  
  // Mobile: Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    try {
      const dashboard = await dashboardAPI.getDashboard();
      if (dashboard) {
        const cleanedTabs = (dashboard.tabs || DEFAULT_TABS).map(tab => ({
          ...tab,
          widgets: (tab.widgets || []).map(widget => ({
            ...widget,
            data: widget.data || {}
          }))
        }));
        setTabs(cleanedTabs);
        setSettings(dashboard.settings || settings);
        prevTabsRef.current = cleanedTabs;
        prevSettingsRef.current = dashboard.settings;
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  }, [settings]);
  
  const { 
    pullDistance, 
    pullProgress, 
    isRefreshing, 
    shouldTrigger 
  } = usePullToRefresh(handleRefresh);

  // Load dashboard from backend
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboard = await dashboardAPI.getDashboard();
        console.log('📥 Dashboard geladen:', dashboard);
        
        if (dashboard) {
          // Ensure all widgets have a data property
          const cleanedTabs = (dashboard.tabs || DEFAULT_TABS).map(tab => ({
            ...tab,
            widgets: (tab.widgets || []).map(widget => ({
              ...widget,
              data: widget.data || {}
            }))
          }));
          
          console.log('✅ Bereinigte Tabs:', cleanedTabs);
          
          setTabs(cleanedTabs);
          setActiveTabId(cleanedTabs[0]?.id || DEFAULT_TABS[0]?.id);
          
          const loadedSettings = dashboard.settings || settings;
          setSettings(loadedSettings);
          setDashboardVersion(dashboard.version || 1);
          
          // Apply theme from backend
          if (loadedSettings.theme) {
            setLocalTheme(loadedSettings.theme);
          }
          
          // Initialize refs with loaded data
          prevTabsRef.current = cleanedTabs;
          prevSettingsRef.current = loadedSettings;
        }
      } catch (err) {
        console.error('❌ Failed to load dashboard:', err);
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save dashboard to backend (debounced) - only when changes occur
  useEffect(() => {
    if (loading) return; // Don't save during initial load

    // Check if data actually changed
    const tabsChanged = JSON.stringify(tabs) !== JSON.stringify(prevTabsRef.current);
    const settingsChanged = JSON.stringify(settings) !== JSON.stringify(prevSettingsRef.current);
    
    if (!tabsChanged && !settingsChanged) {
      return; // No changes, don't save
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSaving(true);
        console.log('💾 Speichere Dashboard:', { tabs, settings });
        const savedDashboard = await dashboardAPI.updateDashboard({ tabs, settings });
        console.log('✅ Dashboard gespeichert:', savedDashboard);
        setDashboardVersion(savedDashboard.version || dashboardVersion + 1);
        
        // Sync to other devices
        syncDashboard(tabs, settings, savedDashboard.version || dashboardVersion);
        
        // Update refs with current values
        prevTabsRef.current = tabs;
        prevSettingsRef.current = settings;
      } catch (err) {
        console.error('❌ Failed to save dashboard:', err);
      } finally {
        setSaving(false);
      }
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [tabs, settings, loading, syncDashboard, dashboardVersion]);

  // Listen for sync updates from other devices
  useEffect(() => {
    const handleDashboardSynced = (event) => {
      const { tabs: syncedTabs, settings: syncedSettings, version, updatedBy } = event.detail;
      console.log('🔄 Dashboard synced from device:', updatedBy);
      
      setTabs(syncedTabs);
      setSettings(syncedSettings);
      setDashboardVersion(version);
      
      // Update refs to prevent re-saving
      prevTabsRef.current = syncedTabs;
      prevSettingsRef.current = syncedSettings;
    };

    window.addEventListener('dashboard_synced', handleDashboardSynced);
    return () => window.removeEventListener('dashboard_synced', handleDashboardSynced);
  }, []);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Tab Management
  const handleAddTab = useCallback(() => {
    const newTab = {
      id: generateId(),
      name: `Tab ${tabs.length + 1}`,
      widgets: [],
      layouts: { lg: [] }
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  const handleRemoveTab = useCallback((tabId) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  // Widget Management
  const handleAddWidget = useCallback((widgetConfig) => {
    const newWidget = {
      id: generateId(),
      type: widgetConfig.type,
      title: widgetConfig.title,
      data: widgetConfig.data || {}
    };

    const defaultSize = DEFAULT_WIDGET_SIZES[widgetConfig.type] || { w: 2, h: 2, minW: 1, minH: 1 };
    
    const newLayout = {
      i: newWidget.id,
      x: 0,
      y: Infinity, // Place at bottom
      w: defaultSize.w,
      h: defaultSize.h,
      minW: defaultSize.minW,
      minH: defaultSize.minH
    };

    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          widgets: [...tab.widgets, newWidget],
          layouts: {
            ...tab.layouts,
            lg: [...(tab.layouts.lg || []), newLayout]
          }
        };
      }
      return tab;
    });

    setTabs(updatedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  const handleRemoveWidget = useCallback((widgetId) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          widgets: tab.widgets.filter(w => w.id !== widgetId),
          layouts: {
            ...tab.layouts,
            lg: tab.layouts.lg?.filter(l => l.i !== widgetId) || []
          }
        };
      }
      return tab;
    });
    setTabs(updatedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  const handleUpdateWidget = useCallback((widgetId, newData) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          widgets: tab.widgets.map(w => 
            w.id === widgetId ? { ...w, data: newData } : w
          )
        };
      }
      return tab;
    });
    setTabs(updatedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  const handleLayoutChange = useCallback((newLayouts) => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          layouts: newLayouts
        };
      }
      return tab;
    });
    setTabs(updatedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  // Import/Export
  const handleExport = useCallback(() => {
    const data = {
      tabs,
      settings,
      version: '2.0',
      exportDate: new Date().toISOString()
    };
    exportToJSON(data);
  }, [tabs, settings]);

  // Toggle theme and save to backend
  const handleToggleTheme = useCallback(async () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    
    // Update local state immediately
    setLocalTheme(newTheme);
    const updatedSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    
    // Save to backend if logged in
    if (currentUser) {
      try {
        await dashboardAPI.updateDashboard({ tabs, settings: updatedSettings });
        console.log('✅ Theme gespeichert:', newTheme);
      } catch (err) {
        console.error('❌ Failed to save theme:', err);
      }
    }
  }, [settings, tabs, currentUser, setLocalTheme]);

  const handleImport = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.json')) {
        const data = await importFromJSON(file);
        if (data.tabs) {
          setTabs(data.tabs);
          setActiveTabId(data.tabs[0]?.id);
        }
        if (data.settings) {
          setSettings(data.settings);
        }
        alert('Import erfolgreich!');
      } else if (file.name.endsWith('.html')) {
        const text = await file.text();
        const bookmarks = parseHTMLBookmarks(text);
        
        if (bookmarks.length > 0) {
          // Add bookmarks to current tab
          const updatedTabs = tabs.map(tab => {
            if (tab.id === activeTabId) {
              const newWidgets = bookmarks.map(bookmark => ({
                id: generateId(),
                type: 'bookmark-list',
                title: 'Importierte Lesezeichen',
                data: { bookmarks: [bookmark] }
              }));
              
              return {
                ...tab,
                widgets: [...tab.widgets, ...newWidgets]
              };
            }
            return tab;
          });
          
          setTabs(updatedTabs);
          alert(`${bookmarks.length} Lesezeichen importiert!`);
        }
      }
    } catch (error) {
      alert('Fehler beim Import: ' + error.message);
    }
    
    e.target.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-white text-xl">Lädt Dashboard...</div>
      </div>
    );
  }

  const backgroundStyle = settings.background?.type === 'gradient'
    ? { background: settings.background.value }
    : { backgroundColor: settings.background?.value || '#f3f4f6' };

  const fontClass = settings.fontFamily || 'font-inter';

  return (
    <div className={`min-h-screen ${fontClass} pb-20 md:pb-0`} style={backgroundStyle} {...swipeBind()}>
      {/* Pull to Refresh Indicator (Mobile) */}
      <PullToRefreshIndicator 
        pullDistance={pullDistance}
        pullProgress={pullProgress}
        isRefreshing={isRefreshing}
        shouldTrigger={shouldTrigger}
      />
      
      {settings.showGridLines && (
        <div 
          className="grid-lines-overlay" 
          style={{ 
            '--grid-cols': settings.gridCols || 10,
            '--grid-rows': 20 
          }}
        />
      )}
      
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden md:block">
        <Header
          theme={settings.theme || theme}
          toggleTheme={handleToggleTheme}
          onAddWidget={() => setShowAddWidget(true)}
          onOpenSettings={() => setShowSettings(true)}
          onExport={handleExport}
          onImport={handleImport}
          onLogout={currentUser ? handleLogout : undefined}
          currentUser={currentUser}
          saving={saving}
        />
      </div>
      
      {/* Mobile Header - simplified */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Who.Me
          </h1>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-gray-500">Speichert...</span>
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {activeTab?.name || 'Tab'}
            </span>
          </div>
        </div>
      </header>

      <TabBar
        tabs={tabs}
        activeTab={activeTabId}
        onTabChange={setActiveTabId}
        onAddTab={handleAddTab}
        onRemoveTab={handleRemoveTab}
      />

      <main className="pt-20 md:pt-32 pb-24 md:pb-8 px-2 sm:px-4 max-w-[1920px] mx-auto">
        <DashboardGrid
          widgets={activeTab?.widgets || []}
          layouts={activeTab?.layouts || { lg: [] }}
          onLayoutChange={handleLayoutChange}
          onRemoveWidget={handleRemoveWidget}
          onUpdateWidget={handleUpdateWidget}
          settings={settings}
        />
      </main>

      <Suspense fallback={null}>
        <AddWidgetModal
          isOpen={showAddWidget}
          onClose={() => setShowAddWidget(false)}
          onAddWidget={handleAddWidget}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={setSettings}
        />
      </Suspense>

      <ConflictResolutionModal
        conflict={syncConflict}
        onResolve={(resolution, data) => {
          resolveConflict(resolution, data);
          // Update local state with resolved data
          setTabs(data.merged.tabs);
          setSettings(data.merged.settings);
        }}
        onClose={() => {
          // If user closes without resolving, use server data
          if (syncConflict) {
            setTabs(syncConflict.serverData.tabs);
            setSettings(syncConflict.serverData.settings);
          }
        }}
      />

      {/* Mobile Tab Sheet */}
      <MobileTabSheet
        isOpen={showMobileTabSheet}
        onClose={() => setShowMobileTabSheet(false)}
        tabs={tabs}
        activeTab={activeTabId}
        onTabChange={setActiveTabId}
        onAddTab={handleAddTab}
        onRemoveTab={handleRemoveTab}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        theme={settings.theme || theme}
        toggleTheme={handleToggleTheme}
        onAddWidget={() => setShowAddWidget(true)}
        onOpenSettings={() => setShowSettings(true)}
        onExport={handleExport}
        onImport={handleImport}
        onLogout={currentUser ? handleLogout : undefined}
        onShowTabs={() => setShowMobileTabSheet(true)}
        currentUser={currentUser}
      />

      <DataSecurityNotice />
      <MobileScrollHint />
    </div>
  );
}

export default DashboardPage;
