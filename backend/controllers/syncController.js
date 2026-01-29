import DashboardSync from '../models/DashboardSync.js';
import Dashboard from '../models/Dashboard.js';

// Socket.IO Sync Handler
export const handleSync = (io) => {
  // Map um aktive Verbindungen zu tracken
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Authenticate user via token
    socket.on('authenticate', async ({ token, deviceId, deviceName }) => {
      try {
        // Token wird bereits im auth middleware validiert
        const userId = socket.handshake.auth.userId;
        
        if (!userId) {
          socket.emit('auth_error', { message: 'Nicht autorisiert' });
          return;
        }

        // Benutzer mit Socket verknüpfen
        socket.userId = userId;
        socket.deviceId = deviceId;

        // User zu Raum hinzufügen
        socket.join(`user_${userId}`);

        // Socket zur Map hinzufügen
        if (!userSockets.has(userId)) {
          userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);

        // Sync-Eintrag erstellen/aktualisieren
        const dashboard = await Dashboard.findOne({ user: userId });
        
        if (dashboard) {
          await DashboardSync.findOneAndUpdate(
            { dashboard: dashboard._id, deviceId },
            {
              user: userId,
              deviceName: deviceName || 'Unbekanntes Gerät',
              lastSyncAt: new Date(),
              syncVersion: dashboard.version
            },
            { upsert: true, new: true }
          );

          socket.emit('authenticated', {
            success: true,
            currentVersion: dashboard.version
          });
        }

        console.log(`User ${userId} authenticated from device ${deviceId}`);
      } catch (error) {
        console.error('Auth error:', error);
        socket.emit('auth_error', { message: 'Authentifizierung fehlgeschlagen' });
      }
    });

    // Dashboard-Update von Client
    socket.on('dashboard_update', async (data) => {
      try {
        const { tabs, settings, version, deviceId } = data;
        const userId = socket.userId;

        if (!userId) {
          socket.emit('sync_error', { message: 'Nicht authentifiziert' });
          return;
        }

        const dashboard = await Dashboard.findOne({ user: userId });

        if (!dashboard) {
          socket.emit('sync_error', { message: 'Dashboard nicht gefunden' });
          return;
        }

        // Conflict Detection
        if (version < dashboard.version) {
          // Konflikt erkannt!
          socket.emit('sync_conflict', {
            localVersion: version,
            serverVersion: dashboard.version,
            serverData: {
              tabs: dashboard.tabs,
              settings: dashboard.settings
            },
            localData: {
              tabs,
              settings
            }
          });
          return;
        }

        // Update Dashboard
        dashboard.tabs = tabs;
        dashboard.settings = settings;
        dashboard.version = version + 1;
        await dashboard.save();

        // Sync-Status aktualisieren
        await DashboardSync.findOneAndUpdate(
          { dashboard: dashboard._id, deviceId },
          {
            lastSyncAt: new Date(),
            syncVersion: dashboard.version
          }
        );

        // An alle anderen Geräte des Benutzers senden
        socket.to(`user_${userId}`).emit('dashboard_synced', {
          tabs: dashboard.tabs,
          settings: dashboard.settings,
          version: dashboard.version,
          updatedBy: deviceId
        });

        // Bestätigung an sender
        socket.emit('sync_success', {
          version: dashboard.version,
          syncedAt: new Date()
        });

        console.log(`Dashboard synced for user ${userId}, version ${dashboard.version}`);
      } catch (error) {
        console.error('Sync error:', error);
        socket.emit('sync_error', { message: 'Sync fehlgeschlagen' });
      }
    });

    // Konfliktauflösung
    socket.on('resolve_conflict', async (data) => {
      try {
        const { resolution, data: resolvedData, deviceId } = data;
        const userId = socket.userId;

        if (!userId) {
          socket.emit('sync_error', { message: 'Nicht authentifiziert' });
          return;
        }

        const dashboard = await Dashboard.findOne({ user: userId });

        if (!dashboard) {
          socket.emit('sync_error', { message: 'Dashboard nicht gefunden' });
          return;
        }

        // Konflikt speichern
        await DashboardSync.findOneAndUpdate(
          { dashboard: dashboard._id, deviceId },
          {
            $push: {
              conflicts: {
                field: 'dashboard',
                localValue: resolvedData.local,
                serverValue: resolvedData.server,
                resolvedAt: new Date(),
                resolution
              }
            }
          }
        );

        // Je nach Resolution die Daten übernehmen
        let finalData;
        if (resolution === 'local') {
          finalData = resolvedData.local;
        } else if (resolution === 'server') {
          finalData = resolvedData.server;
        } else {
          finalData = resolvedData.merged;
        }

        dashboard.tabs = finalData.tabs;
        dashboard.settings = finalData.settings;
        dashboard.version += 1;
        await dashboard.save();

        // An alle Geräte senden
        io.to(`user_${userId}`).emit('dashboard_synced', {
          tabs: dashboard.tabs,
          settings: dashboard.settings,
          version: dashboard.version,
          conflictResolved: true
        });

        console.log(`Conflict resolved for user ${userId}`);
      } catch (error) {
        console.error('Conflict resolution error:', error);
        socket.emit('sync_error', { message: 'Konfliktauflösung fehlgeschlagen' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const userId = socket.userId;
      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        
        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });
};

// REST API Endpoints für Sync-Status

// @desc    Get sync status for all devices
// @route   GET /api/sync/devices
// @access  Private
export const getSyncDevices = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ user: req.user.id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    const devices = await DashboardSync.find({ dashboard: dashboard._id })
      .sort({ lastSyncAt: -1 })
      .select('deviceId deviceName lastSyncAt syncVersion conflicts');

    res.json({
      success: true,
      devices,
      currentVersion: dashboard.version
    });
  } catch (error) {
    console.error('Get sync devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Geräte',
      error: error.message
    });
  }
};

// @desc    Remove device from sync
// @route   DELETE /api/sync/devices/:deviceId
// @access  Private
export const removeDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const dashboard = await Dashboard.findOne({ user: req.user.id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    await DashboardSync.findOneAndDelete({
      dashboard: dashboard._id,
      deviceId
    });

    res.json({
      success: true,
      message: 'Gerät erfolgreich entfernt'
    });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Entfernen des Geräts',
      error: error.message
    });
  }
};
