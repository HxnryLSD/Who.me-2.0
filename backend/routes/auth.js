import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Benutzername muss 3-30 Zeichen lang sein'),
  body('email').isEmail().normalizeEmail().withMessage('Gültige E-Mail erforderlich'),
  body('password').isLength({ min: 6 }).withMessage('Passwort muss mindestens 6 Zeichen lang sein')
], register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('usernameOrEmail').notEmpty().withMessage('Benutzername oder E-Mail erforderlich'),
  body('password').notEmpty().withMessage('Passwort erforderlich')
], login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('displayName').optional().trim().isLength({ max: 50 }),
  body('isPublic').optional().isBoolean()
], updateProfile);

export default router;
