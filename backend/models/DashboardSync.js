import mongoose from 'mongoose';

const DashboardSyncSchema = new mongoose.Schema({
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
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    default: 'Unbekanntes Gerät'
  },
  lastSyncAt: {
    type: Date,
    default: Date.now
  },
  syncVersion: {
    type: Number,
    required: true,
    default: 0
  },
  conflicts: [{
    field: String,
    localValue: mongoose.Schema.Types.Mixed,
    serverValue: mongoose.Schema.Types.Mixed,
    resolvedAt: Date,
    resolution: {
      type: String,
      enum: ['local', 'server', 'manual']
    }
  }]
}, {
  timestamps: true
});

// Indexes
DashboardSyncSchema.index({ dashboard: 1, deviceId: 1 }, { unique: true });
DashboardSyncSchema.index({ user: 1, lastSyncAt: -1 });

const DashboardSync = mongoose.model('DashboardSync', DashboardSyncSchema);

export default DashboardSync;
