import express from 'express';
import { getAlerts, createAlert, deleteAlert } from '../controllers/alertController.js';

const router = express.Router();

router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

export default router;
