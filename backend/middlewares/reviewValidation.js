import { body, validationResult } from 'express-validator';

export const validateReview = [
  body('lugarId').isMongoId().withMessage('ID de lugar inválido'),
  body('comentario').notEmpty().withMessage('El comentario es requerido'),
  body('calificacion').isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser un número del 1 al 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateReviewStatus = [
  body('estado').isIn(['aprobada', 'bloqueada']).withMessage('Estado inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
]; 