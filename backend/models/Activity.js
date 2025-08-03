import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['user', 'place', 'review', 'notification', 'login', 'logout'],
  },
  details: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['User', 'Place', 'Review', 'Notification']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de consultas
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ resourceType: 1, resourceId: 1 });

export default mongoose.model('Activity', activitySchema); 