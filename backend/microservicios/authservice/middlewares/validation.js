import { body, validationResult } from 'express-validator';
import { validationResponse } from '../utils/response.js';

/**
 * Middleware para manejar errores de validación
 */
export const manejarErroresValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationResponse(res, errors);
  }
  next();
};

/**
 * Validaciones para registro de usuario
 */
export const validarRegistro = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('correo')
    .isEmail()
    .withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('rol')
    .optional()
    .isIn(['usuario', 'propietario', 'gad'])
    .withMessage('El rol debe ser: usuario, propietario o gad'),
  
  manejarErroresValidacion
];

/**
 * Validaciones para login
 */
export const validarLogin = [
  body('correo')
    .isEmail()
    .withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  
  body('contraseña')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  manejarErroresValidacion
];

/**
 * Validaciones para cambio de contraseña
 */
export const validarCambioContraseña = [
  body('contraseñaActual')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('nuevaContraseña')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  manejarErroresValidacion
];

/**
 * Validaciones para actualización de perfil
 */
export const validarActualizacionPerfil = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('correo')
    .optional()
    .isEmail()
    .withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  
  body('rol')
    .optional()
    .isIn(['usuario', 'propietario', 'gad'])
    .withMessage('El rol debe ser: usuario, propietario o gad'),
  
  manejarErroresValidacion
];

/**
 * Validaciones para crear usuario como admin
 */
export const validarCrearUsuario = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('correo')
    .isEmail()
    .withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('rol')
    .isIn(['usuario', 'propietario', 'gad'])
    .withMessage('El rol debe ser: usuario, propietario o gad'),
  
  manejarErroresValidacion
]; 