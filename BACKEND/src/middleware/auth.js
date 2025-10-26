const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Initialize Supabase client conditionally
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.log('⚠️  Supabase disabled in auth middleware (mock mode)');
}

// Middleware to verify Supabase JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // If Supabase is not configured, skip authentication in test/mock mode
    if (!supabase) {
      console.log('⚠️  Authentication skipped (Supabase not configured)');
      return res.status(401).json({ error: 'Authentication not configured' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
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
        isActive: true
      }
    });

    if (!dbUser || !dbUser.isActive) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    // Add user info to request
    req.user = {
      ...dbUser,
      supabaseUser: user
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check user roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware to check if user can access department data
const requireDepartmentAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin and service role can access all departments
  if (['admin', 'service_role'].includes(req.user.role)) {
    return next();
  }

  // HR managers can only access their department
  if (req.user.role === 'hr_manager') {
    const targetUserId = req.params.userId || req.body.userId;
    if (targetUserId && targetUserId !== req.user.id) {
      // Check if target user is in same department
      req.departmentFilter = req.user.department;
    }
  }

  next();
};

// Middleware to validate request data
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req.body = value;
    next();
  };
};

// Middleware to handle async errors
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware to log API requests
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Middleware to add request ID for tracing
const addRequestId = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || 
    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireDepartmentAccess,
  validateRequest,
  asyncHandler,
  logRequest,
  addRequestId
};


