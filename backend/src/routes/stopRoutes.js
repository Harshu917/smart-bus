import express from 'express';
import { getStops, getStopById } from '../controllers/stopController.js';

const router = express.Router();

router.get('/', getStops);
router.get('/:id', getStopById);

export default router;
