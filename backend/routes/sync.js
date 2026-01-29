import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSyncDevices,
  removeDevice
} from '../controllers/syncController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/devices', getSyncDevices);
router.delete('/devices/:deviceId', removeDevice);

export default router;
