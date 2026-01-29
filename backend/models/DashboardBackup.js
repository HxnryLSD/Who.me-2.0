import mongoose from 'mongoose';

const DashboardBackupSchema = new mongoose.Schema({
  dashboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    tabs: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  version: {
    type: Number,
    required: true
  },
  changeDescription: {
    type: String,
    default: 'Automatisches Backup'
  },
  isAutomatic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes für bessere Performance
DashboardBackupSchema.index({ dashboard: 1, createdAt: -1 });
DashboardBackupSchema.index({ user: 1, createdAt: -1 });

// Automatisches Löschen alter Backups (älter als 90 Tage)
DashboardBackupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 Tage

const DashboardBackup = mongoose.model('DashboardBackup', DashboardBackupSchema);

export default DashboardBackup;
