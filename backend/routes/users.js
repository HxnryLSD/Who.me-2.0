import express from 'express';
import { getPublicUsers } from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/public
// @desc    Get all public users
// @access  Public
router.get('/public', getPublicUsers);

export default router;
