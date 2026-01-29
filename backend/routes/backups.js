import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createBackup,
  getBackups,
  restoreBackup,
  deleteBackup
} from '../controllers/backupController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/create', createBackup);
router.get('/', getBackups);
router.post('/:id/restore', restoreBackup);
router.delete('/:id', deleteBackup);

export default router;
