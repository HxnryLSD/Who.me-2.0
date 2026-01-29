import User from '../models/User.js';

// @desc    Get all public users
// @route   GET /api/users/public
// @access  Public
export const getPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true })
      .select('username displayName createdAt')
      .sort({ createdAt: -1 });

    const publicUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      users: publicUsers
    });
  } catch (error) {
    console.error('Get public users error:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der öffentlichen Benutzer',
      error: error.message
    });
  }
};
