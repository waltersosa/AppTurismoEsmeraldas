import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['user', 'place', 'review', 'media', 'notification', 'login', 'logout'],
    default: 'user'
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'enable', 'disable', 'approve', 'reject', 'login', 'logout'],
    default: 'create'
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['User', 'Place', 'Review', 'Media', 'Notification']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
activitySchema.index({ type: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity; 