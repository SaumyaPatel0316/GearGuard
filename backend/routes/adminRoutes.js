import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/authorizeRole.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Invite/Create user (Admin only)
router.post(
  '/users/invite',
  requireAuth,
  requireAdmin,
  [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN']),
    body('department').optional().isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const { name, email, role, department } = req.body;

      // Check if user already exists
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      // Create user with isApproved: true (invited by admin)
      const user = await User.create({
        name,
        email,
        role,
        department,
        isApproved: true,
        passwordHash: '', // Will be set on first Firebase login
        active: true,
      });

      return res.status(201).json({
        message: 'User invited successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Invite user error:', error);
      return res.status(500).json({ message: 'Failed to invite user' });
    }
  }
);

// Update user role (Admin only)
router.patch(
  '/users/:userId/role',
  requireAuth,
  requireAdmin,
  [body('role').isIn(['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Prevent admin from changing their own role
      if (req.user._id.toString() === userId) {
        return res.status(400).json({ message: 'Cannot change your own role' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        message: 'User role updated successfully',
        user,
      });
    } catch (error) {
      console.error('Update role error:', error);
      return res.status(500).json({ message: 'Failed to update user role' });
    }
  }
);

// Update user (Admin only)
router.patch(
  '/users/:userId',
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      // Remove sensitive fields from updates
      delete updates.passwordHash;
      delete updates._id;

      const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      console.error('Update user error:', error);
      return res.status(500).json({ message: 'Failed to update user' });
    }
  }
);

// Delete user (Admin only)
router.delete('/users/:userId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Approve user (Admin only)
router.patch('/users/:userId/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User approved successfully',
      user,
    });
  } catch (error) {
    console.error('Approve user error:', error);
    return res.status(500).json({ message: 'Failed to approve user' });
  }
});

// Deactivate/Activate user (Admin only)
router.patch('/users/:userId/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === userId && !active) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { active },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: `User ${active ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({ message: 'Failed to update user status' });
  }
});

export default router;
