import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido']
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: {
      values: ['usuario', 'propietario', 'gad'],
      message: 'El rol debe ser: usuario, propietario o gad'
    },
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.contraseña;
      return ret;
    }
  }
});

// Índices para mejorar el rendimiento
userSchema.index({ correo: 1 });
userSchema.index({ rol: 1 });
userSchema.index({ activo: 1 });

// Middleware pre-save para hashear la contraseña
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('contraseña')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function(contraseñaCandidata) {
  return await bcrypt.compare(contraseñaCandidata, this.contraseña);
};

// Método para actualizar último acceso
userSchema.methods.actualizarUltimoAcceso = function() {
  this.ultimoAcceso = new Date();
  return this.save();
};

// Método estático para buscar por correo (solo usuarios activos)
userSchema.statics.buscarPorCorreo = function(correo) {
  return this.findOne({ correo: correo.toLowerCase(), activo: true });
};

// Método estático para buscar por correo (incluyendo inactivos)
userSchema.statics.buscarPorCorreoIncluyendoInactivos = function(correo) {
  return this.findOne({ correo: correo.toLowerCase() });
};

// Método estático para verificar si el correo existe (solo usuarios activos)
userSchema.statics.correoExiste = function(correo) {
  return this.exists({ correo: correo.toLowerCase(), activo: true });
};

// Método estático para verificar si el correo existe (incluyendo inactivos)
userSchema.statics.correoExisteIncluyendoInactivos = function(correo) {
  return this.exists({ correo: correo.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User; 