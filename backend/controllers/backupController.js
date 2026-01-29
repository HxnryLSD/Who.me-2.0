import DashboardBackup from '../models/DashboardBackup.js';
import Dashboard from '../models/Dashboard.js';

// @desc    Create backup of dashboard
// @route   POST /api/backups/create
// @access  Private
export const createBackup = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ user: req.user.id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    const { changeDescription } = req.body;

    // Letzte Version abrufen
    const lastBackup = await DashboardBackup.findOne({ dashboard: dashboard._id })
      .sort({ version: -1 })
      .limit(1);

    const newVersion = lastBackup ? lastBackup.version + 1 : 1;

    const backup = await DashboardBackup.create({
      dashboard: dashboard._id,
      user: req.user.id,
      data: {
        tabs: dashboard.tabs,
        settings: dashboard.settings
      },
      version: newVersion,
      changeDescription: changeDescription || 'Manuelles Backup',
      isAutomatic: false
    });

    // Update lastBackupAt
    dashboard.lastBackupAt = new Date();
    await dashboard.save();

    res.status(201).json({
      success: true,
      message: 'Backup erfolgreich erstellt',
      backup: {
        id: backup._id,
        version: backup.version,
        createdAt: backup.createdAt
      }
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Erstellen des Backups',
      error: error.message
    });
  }
};

// @desc    Get all backups for user's dashboard
// @route   GET /api/backups
// @access  Private
export const getBackups = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ user: req.user.id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    const backups = await DashboardBackup.find({ dashboard: dashboard._id })
      .sort({ createdAt: -1 })
      .select('version changeDescription isAutomatic createdAt')
      .limit(50);

    res.json({
      success: true,
      backups
    });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Backups',
      error: error.message
    });
  }
};

// @desc    Restore dashboard from backup
// @route   POST /api/backups/:id/restore
// @access  Private
export const restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await DashboardBackup.findOne({
      _id: id,
      user: req.user.id
    });

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup nicht gefunden'
      });
    }

    const dashboard = await Dashboard.findOne({ user: req.user.id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    // Aktuelles Dashboard als Backup speichern bevor wiederhergestellt wird
    const lastBackup = await DashboardBackup.findOne({ dashboard: dashboard._id })
      .sort({ version: -1 })
      .limit(1);

    const newVersion = lastBackup ? lastBackup.version + 1 : 1;

    await DashboardBackup.create({
      dashboard: dashboard._id,
      user: req.user.id,
      data: {
        tabs: dashboard.tabs,
        settings: dashboard.settings
      },
      version: newVersion,
      changeDescription: 'Backup vor Wiederherstellung',
      isAutomatic: true
    });

    // Dashboard wiederherstellen
    dashboard.tabs = backup.data.tabs;
    dashboard.settings = backup.data.settings;
    dashboard.version += 1;
    await dashboard.save();

    res.json({
      success: true,
      message: 'Dashboard erfolgreich wiederhergestellt',
      dashboard: {
        tabs: dashboard.tabs,
        settings: dashboard.settings,
        version: dashboard.version
      }
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Wiederherstellen des Backups',
      error: error.message
    });
  }
};

// @desc    Delete a backup
// @route   DELETE /api/backups/:id
// @access  Private
export const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await DashboardBackup.findOne({
      _id: id,
      user: req.user.id
    });

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup nicht gefunden'
      });
    }

    await backup.deleteOne();

    res.json({
      success: true,
      message: 'Backup erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen des Backups',
      error: error.message
    });
  }
};

// @desc    Auto-create backup (called automatically)
// @access  Internal
export const autoCreateBackup = async (dashboardId, userId) => {
  try {
    const dashboard = await Dashboard.findById(dashboardId);

    if (!dashboard) {
      return;
    }

    const lastBackup = await DashboardBackup.findOne({ dashboard: dashboardId })
      .sort({ version: -1 })
      .limit(1);

    const newVersion = lastBackup ? lastBackup.version + 1 : 1;

    await DashboardBackup.create({
      dashboard: dashboardId,
      user: userId,
      data: {
        tabs: dashboard.tabs,
        settings: dashboard.settings
      },
      version: newVersion,
      changeDescription: 'Automatisches Backup',
      isAutomatic: true
    });

    dashboard.lastBackupAt = new Date();
    await dashboard.save();
  } catch (error) {
    console.error('Auto backup error:', error);
  }
};
