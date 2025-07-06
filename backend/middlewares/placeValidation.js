import { body, validationResult } from 'express-validator';

// Validación para crear lugar (campos requeridos)
export const validateCreatePlace = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La ubicación debe tener entre 5 y 200 caracteres'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  body('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('La URL de la imagen de portada debe ser válida'),
  
  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('Las URLs de imágenes deben ser un array'),
  
  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('Cada URL de imagen debe ser válida'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('El campo active debe ser un booleano')
];

// Validación para actualizar lugar (campos opcionales)
export const validateUpdatePlace = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La ubicación debe tener entre 5 y 200 caracteres'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  body('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('La URL de la imagen de portada debe ser válida'),
  
  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('Las URLs de imágenes deben ser un array'),
  
  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('Cada URL de imagen debe ser válida'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('El campo active debe ser un booleano')
];

// Validación para actualizaciones parciales (solo campos específicos)
export const validatePartialUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La ubicación debe tener entre 5 y 200 caracteres'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  
  body('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('La URL de la imagen de portada debe ser válida'),
  
  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('Las URLs de imágenes deben ser un array'),
  
  body('imageUrls.*')
    .optional()
    .isURL()
    .withMessage('Cada URL de imagen debe ser válida'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('El campo active debe ser un booleano')
];

// Validación legacy (mantener para compatibilidad)
export const validatePlace = validateCreatePlace;

// Middleware para limpiar y mapear datos de entrada
export const cleanPlaceData = (req, res, next) => {
  try {
    // Si hay datos en el campo 'images' que son URLs, moverlos a 'imageUrls'
    if (req.body.images && Array.isArray(req.body.images)) {
      const urlImages = [];
      const objectIdImages = [];
      
      req.body.images.forEach(item => {
        if (typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))) {
          // Es una URL, mover a imageUrls
          urlImages.push(item);
        } else if (typeof item === 'string' && item.match(/^[0-9a-fA-F]{24}$/)) {
          // Es un ObjectId válido, mantener en images
          objectIdImages.push(item);
        }
        // Si no es ni URL ni ObjectId válido, ignorarlo
      });
      
      // Actualizar los campos
      if (urlImages.length > 0) {
        req.body.imageUrls = urlImages;
      }
      
      if (objectIdImages.length > 0) {
        req.body.images = objectIdImages;
      } else {
        // Si no hay ObjectIds válidos, limpiar el campo images
        delete req.body.images;
      }
    }
    
    // Si hay datos en el campo 'coverImage' que es una URL, moverlo a 'coverImageUrl'
    if (req.body.coverImage && typeof req.body.coverImage === 'string') {
      if (req.body.coverImage.startsWith('http://') || req.body.coverImage.startsWith('https://')) {
        // Es una URL, mover a coverImageUrl
        req.body.coverImageUrl = req.body.coverImage;
        delete req.body.coverImage;
      } else if (!req.body.coverImage.match(/^[0-9a-fA-F]{24}$/)) {
        // No es un ObjectId válido, limpiarlo
        delete req.body.coverImage;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
}; 