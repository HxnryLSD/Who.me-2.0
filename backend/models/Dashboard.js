import mongoose from 'mongoose';

const WidgetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['bookmark', 'bookmark-list', 'todo', 'note', 'clock', 'weather', 'rss']
  },
  title: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const TabSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  widgets: [WidgetSchema],
  layouts: {
    type: mongoose.Schema.Types.Mixed,
    default: { lg: [] }
  }
}, { _id: false });

const DashboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tabs: [TabSchema],
  settings: {
    background: {
      type: {
        type: String,
        enum: ['gradient', 'color']
      },
      value: String,
      label: String
    },
    gridCols: {
      type: Number,
      default: 10,
      min: 6,
      max: 10
    },
    widgetOpacity: {
      type: Number,
      default: 100
    }
  },
  version: {
    type: Number,
    default: 1
  },
  lastBackupAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
DashboardSchema.index({ user: 1 });

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

export default Dashboard;
