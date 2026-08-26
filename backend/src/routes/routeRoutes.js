import express from 'express';
import { getRoutes, getRouteById } from '../controllers/routeController.js';

const router = express.Router();

router.get('/', getRoutes);
router.get('/:id', getRouteById);

export default router;
