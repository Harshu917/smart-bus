import express from 'express';
import { getDriverDashboard, updatePassengerCount } from '../controllers/driverController.js';

const router = express.Router();

router.get('/:busId', getDriverDashboard);
router.patch('/:busId/passengers', updatePassengerCount);

export default router;
