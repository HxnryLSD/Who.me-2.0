import express from 'express';
import {
  getDashboard,
  createDashboard,
  updateDashboard,
  getPublicDashboard
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboards/me
// @desc    Get current user's dashboard
// @access  Private
router.get('/me', protect, getDashboard);

// @route   POST /api/dashboards
// @desc    Create or update dashboard
// @access  Private
router.post('/', protect, createDashboard);

// @route   PUT /api/dashboards
// @desc    Update dashboard
// @access  Private
router.put('/', protect, updateDashboard);

// @route   GET /api/dashboards/public/:username
// @desc    Get public dashboard by username
// @access  Public
router.get('/public/:username', getPublicDashboard);

export default router;
