import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SyncContext = createContext();

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};

export const SyncProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncConflict, setSyncConflict] = useState(null);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  // Generate unique device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows PC';
    if (ua.includes('Mac')) return 'Mac';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unbekanntes Gerät';
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { userId: user.id },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      // Authenticate
      newSocket.emit('authenticate', {
        token,
        deviceId: getDeviceId(),
        deviceName: getDeviceName()
      });
    });

    newSocket.on('authenticated', (data) => {
      console.log('Authenticated with server', data);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('auth_error', (data) => {
      console.error('Auth error:', data.message);
      setIsConnected(false);
    });

    newSocket.on('sync_success', (data) => {
      console.log('Sync successful', data);
      setIsSyncing(false);
      setLastSyncAt(new Date(data.syncedAt));
    });

    newSocket.on('sync_error', (data) => {
      console.error('Sync error:', data.message);
      setIsSyncing(false);
    });

    newSocket.on('sync_conflict', (data) => {
      console.log('Sync conflict detected', data);
      setIsSyncing(false);
      setSyncConflict(data);
    });

    newSocket.on('dashboard_synced', (data) => {
      console.log('Dashboard synced from another device', data);
      // This will be handled by the dashboard context/component
      window.dispatchEvent(new CustomEvent('dashboard_synced', { detail: data }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  const syncDashboard = (tabs, settings, version) => {
    if (!socket || !isConnected) {
      console.warn('Socket not connected, cannot sync');
      return;
    }

    setIsSyncing(true);
    socket.emit('dashboard_update', {
      tabs,
      settings,
      version,
      deviceId: getDeviceId()
    });
  };

  const resolveConflict = (resolution, data) => {
    if (!socket || !isConnected) {
      console.warn('Socket not connected, cannot resolve conflict');
      return;
    }

    socket.emit('resolve_conflict', {
      resolution,
      data,
      deviceId: getDeviceId()
    });

    setSyncConflict(null);
  };

  const value = {
    isConnected,
    isSyncing,
    syncConflict,
    lastSyncAt,
    syncDashboard,
    resolveConflict
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
