import express from 'express';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();

// Endpoint principal de estadísticas
router.get('/overview', getStats);

export default router; 