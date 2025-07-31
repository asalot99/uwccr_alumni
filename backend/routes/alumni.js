const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Alumni = require('../models/Alumni');
const { authenticateToken, requireVerification } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/alumni/register
// @desc    Register new alumni
// @access  Public
router.post('/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('graduationYear').isInt({ min: 1950, max: new Date().getFullYear() + 5 }).withMessage('Valid graduation year required'),
  body('program').isIn(['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Other']).withMessage('Valid program required'),
  body('location.name').trim().notEmpty().withMessage('Location name required'),
  body('location.country').trim().notEmpty().withMessage('Country required'),
  body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('location.lon').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password, graduationYear, program, location } = req.body;

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({ 
        success: false, 
        message: 'Alumni with this email already exists' 
      });
    }

    // Create new alumni
    const alumni = new Alumni({
      firstName,
      lastName,
      email,
      password,
      graduationYear,
      program,
      location
    });

    await alumni.save();

    // Generate token
    const token = generateToken(alumni._id);

    res.status(201).json({
      success: true,
      message: 'Alumni registered successfully',
      token,
      user: alumni.getFullProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST /api/alumni/login
// @desc    Login alumni
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find alumni
    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await alumni.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last active
    alumni.lastActive = new Date();
    await alumni.save();

    // Generate token
    const token = generateToken(alumni._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: alumni.getFullProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route   GET /api/alumni/profile
// @desc    Get current alumni profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getFullProfile()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching profile' 
    });
  }
});

// @route   PUT /api/alumni/profile
// @desc    Update alumni profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('graduationYear').optional().isInt({ min: 1950, max: new Date().getFullYear() + 5 }),
  body('program').optional().isIn(['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Other']),
  body('bio').optional().isLength({ max: 500 }),
  body('currentCompany').optional().isLength({ max: 100 }),
  body('jobTitle').optional().isLength({ max: 100 }),
  body('isPublic').optional().isBoolean(),
  body('showLocation').optional().isBoolean(),
  body('showEmail').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const updateFields = req.body;
    delete updateFields.email; // Prevent email changes
    delete updateFields.password; // Use separate route for password changes

    const alumni = await Alumni.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: alumni.getFullProfile()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating profile' 
    });
  }
});

// @route   PUT /api/alumni/location
// @desc    Update alumni location
// @access  Private
router.put('/location', [
  authenticateToken,
  body('location.name').trim().notEmpty().withMessage('Location name required'),
  body('location.country').trim().notEmpty().withMessage('Country required'),
  body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('location.lon').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const alumni = await Alumni.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { location: req.body.location },
        $currentDate: { lastActive: true }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: alumni.location
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating location' 
    });
  }
});

// @route   GET /api/alumni/map
// @desc    Get alumni locations for map (public data only)
// @access  Public
router.get('/map', async (req, res) => {
  try {
    const alumni = await Alumni.find({
      isVerified: true,
      showLocation: true,
      'location.lat': { $exists: true, $ne: null },
      'location.lon': { $exists: true, $ne: null }
    }).select('firstName lastName graduationYear program location bio currentCompany jobTitle lastActive');

    const mapData = alumni.map(alumni => ({
      id: alumni._id,
      name: `${alumni.firstName} ${alumni.lastName}`,
      graduationYear: alumni.graduationYear,
      program: alumni.program,
      location: alumni.location,
      bio: alumni.bio,
      currentCompany: alumni.currentCompany,
      jobTitle: alumni.jobTitle,
      lastActive: alumni.lastActive
    }));

    res.json({
      success: true,
      count: mapData.length,
      alumni: mapData
    });

  } catch (error) {
    console.error('Map data fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching map data' 
    });
  }
});

// @route   GET /api/alumni/search
// @desc    Search alumni (for verified users only)
// @access  Private
router.get('/search', [authenticateToken, requireVerification], async (req, res) => {
  try {
    const { q, program, graduationYear, location } = req.query;
    
    let query = { isVerified: true };
    
    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { currentCompany: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (program) {
      query.program = program;
    }
    
    if (graduationYear) {
      query.graduationYear = parseInt(graduationYear);
    }
    
    if (location) {
      query['location.name'] = { $regex: location, $options: 'i' };
    }

    const alumni = await Alumni.find(query)
      .select('firstName lastName graduationYear program location bio currentCompany jobTitle lastActive')
      .limit(50);

    const searchResults = alumni.map(alumni => ({
      id: alumni._id,
      name: `${alumni.firstName} ${alumni.lastName}`,
      graduationYear: alumni.graduationYear,
      program: alumni.program,
      location: alumni.location,
      bio: alumni.bio,
      currentCompany: alumni.currentCompany,
      jobTitle: alumni.jobTitle,
      lastActive: alumni.lastActive
    }));

    res.json({
      success: true,
      count: searchResults.length,
      alumni: searchResults
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during search' 
    });
  }
});

module.exports = router; 