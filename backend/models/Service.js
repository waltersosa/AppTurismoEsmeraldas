import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  endpoint: {
    type: String,
    required: true,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  tipo: {
    type: String,
    enum: ['api', 'database', 'external', 'internal'],
    default: 'api'
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  ultimaVerificacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['online', 'offline', 'error', 'maintenance'],
    default: 'online'
  },
  tiempoRespuesta: {
    type: Number, // en milisegundos
    default: 0
  },
  estadoReal: {
    type: String,
    enum: ['running', 'stopped', 'starting', 'stopping', 'error'],
    default: 'running'
  },
  puerto: {
    type: Number,
    default: null
  },
  procesoId: {
    type: String,
    default: null
  },
  configuracion: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método para actualizar el estado del servicio
serviceSchema.methods.actualizarEstado = function(nuevoEstado, tiempoRespuesta = null) {
  this.estado = nuevoEstado;
  this.ultimaVerificacion = new Date();
  if (tiempoRespuesta !== null) {
    this.tiempoRespuesta = tiempoRespuesta;
  }
  this.fechaActualizacion = new Date();
  return this.save();
};

// Método para alternar el estado activo/inactivo
serviceSchema.methods.alternarEstado = async function() {
  if (this.activo) {
    // Desactivar servicio
    await this.detenerServicio();
  } else {
    // Activar servicio
    await this.iniciarServicio();
  }
  return this;
};

// Método para iniciar un servicio
serviceSchema.methods.iniciarServicio = async function() {
  try {
    this.estadoReal = 'starting';
    this.fechaActualizacion = new Date();
    await this.save();

    // Simular tiempo de inicio
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular verificación de que el servicio está funcionando
    const inicio = Date.now();
    try {
      const response = await fetch(this.endpoint, {
        method: 'GET',
        timeout: 5000
      });
      const tiempoRespuesta = Date.now() - inicio;

      if (response.ok) {
        this.activo = true;
        this.estadoReal = 'running';
        this.estado = 'online';
        this.tiempoRespuesta = tiempoRespuesta;
        this.procesoId = `proc_${Date.now()}`;
      } else {
        this.estadoReal = 'error';
        this.estado = 'error';
        this.activo = false;
      }
    } catch (error) {
      this.estadoReal = 'error';
      this.estado = 'offline';
      this.activo = false;
    }

    this.ultimaVerificacion = new Date();
    this.fechaActualizacion = new Date();
    return this.save();
  } catch (error) {
    this.estadoReal = 'error';
    this.estado = 'error';
    this.activo = false;
    this.fechaActualizacion = new Date();
    return this.save();
  }
};

// Método para detener un servicio
serviceSchema.methods.detenerServicio = async function() {
  try {
    this.estadoReal = 'stopping';
    this.fechaActualizacion = new Date();
    await this.save();

    // Simular tiempo de parada
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.activo = false;
    this.estadoReal = 'stopped';
    this.estado = 'offline';
    this.procesoId = null;
    this.tiempoRespuesta = 0;
    this.ultimaVerificacion = new Date();
    this.fechaActualizacion = new Date();
    
    return this.save();
  } catch (error) {
    this.estadoReal = 'error';
    this.estado = 'error';
    this.fechaActualizacion = new Date();
    return this.save();
  }
};

// Método estático para verificar el estado de un servicio
serviceSchema.statics.verificarServicio = async function(serviceId) {
  const servicio = await this.findById(serviceId);
  if (!servicio) {
    throw new Error('Servicio no encontrado');
  }

  try {
    const inicio = Date.now();
    const response = await fetch(servicio.endpoint, {
      method: 'GET',
      timeout: 5000
    });
    const tiempoRespuesta = Date.now() - inicio;

    if (response.ok) {
      await servicio.actualizarEstado('online', tiempoRespuesta);
    } else {
      await servicio.actualizarEstado('error', tiempoRespuesta);
    }
  } catch (error) {
    await servicio.actualizarEstado('offline', 0);
  }

  return servicio;
};

const Service = mongoose.model('Service', serviceSchema);

export default Service; 