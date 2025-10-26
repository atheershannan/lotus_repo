const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require('../middleware/auth');

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/auth/login - Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        details: error.message
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: data.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    // Update last active time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    });

    res.json({
      success: true,
      data: {
        user,
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message
    });
  }
}));

// POST /api/auth/logout - Logout user
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (refreshToken) {
      await supabase.auth.signOut({ refreshToken });
    }

    res.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      details: error.message
    });
  }
}));

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: {
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at
        }
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      details: error.message
    });
  }
}));

// GET /api/auth/me - Get current user info
router.get('/me', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        isActive: true,
        createdAt: true,
        lastActiveAt: true
      }
    });

    if (!dbUser || !dbUser.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    res.json({
      success: true,
      data: { user: dbUser }
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user info',
      details: error.message
    });
  }
}));

module.exports = router;


