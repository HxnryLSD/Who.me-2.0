import Dashboard from '../models/Dashboard.js';
import User from '../models/User.js';
import { autoCreateBackup } from './backupController.js';

// @desc    Get user's dashboard
// @route   GET /api/dashboards/me
// @access  Private
export const getDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne({ user: req.user._id });

    // If no dashboard exists, create a default one
    if (!dashboard) {
      dashboard = await Dashboard.create({
        user: req.user._id,
        tabs: [{
          id: `tab-${Date.now()}`,
          name: 'Mein Dashboard',
          widgets: [],
          layouts: { lg: [] }
        }],
        settings: {
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            label: 'Purple Dream'
          },
          gridCols: 10,
          widgetOpacity: 100
        }
      });
    }

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des Dashboards',
      error: error.message
    });
  }
};

// @desc    Create or update dashboard
// @route   POST /api/dashboards
// @access  Private
export const createDashboard = async (req, res) => {
  try {
    const { tabs, settings } = req.body;

    let dashboard = await Dashboard.findOne({ user: req.user._id });

    if (dashboard) {
      // Update existing dashboard
      dashboard.tabs = tabs;
      dashboard.settings = settings;
      await dashboard.save();
    } else {
      // Create new dashboard
      dashboard = await Dashboard.create({
        user: req.user._id,
        tabs,
        settings
      });
    }

    res.json({
      success: true,
      message: 'Dashboard gespeichert',
      dashboard
    });
  } catch (error) {
    console.error('Create dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Speichern des Dashboards',
      error: error.message
    });
  }
};

// @desc    Update dashboard
// @route   PUT /api/dashboards
// @access  Private
export const updateDashboard = async (req, res) => {
  try {
    const { tabs, settings } = req.body;

    const dashboard = await Dashboard.findOne({ user: req.user._id });
    
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    // Auto-backup erstellen alle 10 Versionen oder wenn keine Backups existieren
    const shouldBackup = !dashboard.lastBackupAt || 
                         dashboard.version % 10 === 0;
    
    if (shouldBackup) {
      await autoCreateBackup(dashboard._id, req.user._id);
    }

    // Dashboard aktualisieren
    dashboard.tabs = tabs;
    dashboard.settings = settings;
    dashboard.version += 1;
    await dashboard.save();

    res.json({
      success: true,
      message: 'Dashboard aktualisiert',
      dashboard
    });
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren des Dashboards',
      error: error.message
    });
  }
};

// @desc    Get public dashboard by username
// @route   GET /api/dashboards/public/:username
// @access  Public
export const getPublicDashboard = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    // Check if profile is public
    if (!user.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Dieses Dashboard ist privat'
      });
    }

    // Get dashboard
    const dashboard = await Dashboard.findOne({ user: user._id });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard nicht gefunden'
      });
    }

    res.json({
      success: true,
      dashboard,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get public dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen des öffentlichen Dashboards',
      error: error.message
    });
  }
};
