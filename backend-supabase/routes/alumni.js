const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

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
    const { data: existingAlumni, error: checkError } = await supabase
      .from('alumni')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }

    if (existingAlumni) {
      return res.status(400).json({ 
        success: false, 
        message: 'Alumni with this email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new alumni
    const { data: newAlumni, error: insertError } = await supabase
      .from('alumni')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: passwordHash,
        graduation_year: graduationYear,
        program: program,
        location_name: location.name,
        location_country: location.country,
        location_lat: location.lat,
        location_lon: location.lon
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Generate token
    const token = generateToken(newAlumni.id);

    res.status(201).json({
      success: true,
      message: 'Alumni registered successfully',
      token,
      user: {
        id: newAlumni.id,
        firstName: newAlumni.first_name,
        lastName: newAlumni.last_name,
        email: newAlumni.email,
        graduationYear: newAlumni.graduation_year,
        program: newAlumni.program,
        location: {
          name: newAlumni.location_name,
          country: newAlumni.location_country,
          lat: newAlumni.location_lat,
          lon: newAlumni.location_lon
        },
        isVerified: newAlumni.is_verified,
        isPublic: newAlumni.is_public,
        showLocation: newAlumni.show_location,
        showEmail: newAlumni.show_email,
        createdAt: newAlumni.created_at
      }
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
    const { data: alumni, error: fetchError } = await supabase
      .from('alumni')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !alumni) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, alumni.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last active
    await supabase
      .from('alumni')
      .update({ last_active: new Date().toISOString() })
      .eq('id', alumni.id);

    // Generate token
    const token = generateToken(alumni.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: alumni.id,
        firstName: alumni.first_name,
        lastName: alumni.last_name,
        email: alumni.email,
        graduationYear: alumni.graduation_year,
        program: alumni.program,
        location: {
          name: alumni.location_name,
          country: alumni.location_country,
          lat: alumni.location_lat,
          lon: alumni.location_lon
        },
        bio: alumni.bio,
        currentCompany: alumni.current_company,
        jobTitle: alumni.job_title,
        isVerified: alumni.is_verified,
        isPublic: alumni.is_public,
        showLocation: alumni.show_location,
        showEmail: alumni.show_email,
        lastActive: alumni.last_active,
        createdAt: alumni.created_at
      }
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
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: alumni, error } = await supabase
      .from('alumni')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !alumni) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    res.json({
      success: true,
      user: {
        id: alumni.id,
        firstName: alumni.first_name,
        lastName: alumni.last_name,
        email: alumni.email,
        graduationYear: alumni.graduation_year,
        program: alumni.program,
        location: {
          name: alumni.location_name,
          country: alumni.location_country,
          lat: alumni.location_lat,
          lon: alumni.location_lon
        },
        bio: alumni.bio,
        currentCompany: alumni.current_company,
        jobTitle: alumni.job_title,
        isVerified: alumni.is_verified,
        isPublic: alumni.is_public,
        showLocation: alumni.show_location,
        showEmail: alumni.show_email,
        lastActive: alumni.last_active,
        createdAt: alumni.created_at
      }
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

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const updateFields = {};
    if (req.body.firstName) updateFields.first_name = req.body.firstName;
    if (req.body.lastName) updateFields.last_name = req.body.lastName;
    if (req.body.graduationYear) updateFields.graduation_year = req.body.graduationYear;
    if (req.body.program) updateFields.program = req.body.program;
    if (req.body.bio !== undefined) updateFields.bio = req.body.bio;
    if (req.body.currentCompany !== undefined) updateFields.current_company = req.body.currentCompany;
    if (req.body.jobTitle !== undefined) updateFields.job_title = req.body.jobTitle;
    if (req.body.isPublic !== undefined) updateFields.is_public = req.body.isPublic;
    if (req.body.showLocation !== undefined) updateFields.show_location = req.body.showLocation;
    if (req.body.showEmail !== undefined) updateFields.show_email = req.body.showEmail;

    const { data: alumni, error } = await supabase
      .from('alumni')
      .update(updateFields)
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: alumni.id,
        firstName: alumni.first_name,
        lastName: alumni.last_name,
        email: alumni.email,
        graduationYear: alumni.graduation_year,
        program: alumni.program,
        location: {
          name: alumni.location_name,
          country: alumni.location_country,
          lat: alumni.location_lat,
          lon: alumni.location_lon
        },
        bio: alumni.bio,
        currentCompany: alumni.current_company,
        jobTitle: alumni.job_title,
        isVerified: alumni.is_verified,
        isPublic: alumni.is_public,
        showLocation: alumni.show_location,
        showEmail: alumni.show_email,
        lastActive: alumni.last_active,
        createdAt: alumni.created_at
      }
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

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: alumni, error } = await supabase
      .from('alumni')
      .update({
        location_name: req.body.location.name,
        location_country: req.body.location.country,
        location_lat: req.body.location.lat,
        location_lon: req.body.location.lon,
        last_active: new Date().toISOString()
      })
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: {
        name: alumni.location_name,
        country: alumni.location_country,
        lat: alumni.location_lat,
        lon: alumni.location_lon
      }
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
    const { data: alumni, error } = await supabase
      .from('public_alumni_map')
      .select('*')
      .order('last_active', { ascending: false });

    if (error) {
      throw error;
    }

    const mapData = alumni.map(alumni => ({
      id: alumni.id,
      name: `${alumni.first_name} ${alumni.last_name}`,
      graduationYear: alumni.graduation_year,
      program: alumni.program,
      location: {
        name: alumni.location_name,
        country: alumni.location_country,
        lat: alumni.location_lat,
        lon: alumni.location_lon
      },
      bio: alumni.bio,
      currentCompany: alumni.current_company,
      jobTitle: alumni.job_title,
      lastActive: alumni.last_active
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
router.get('/search', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user is authenticated
    const { data: user, error: userError } = await supabase
      .from('alumni')
      .select('is_verified')
      .eq('id', decoded.userId)
      .single();

    if (userError || !user || !user.is_verified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account verification required' 
      });
    }

    const { q, program, graduationYear, location } = req.query;
    
    let query = supabase
      .from('searchable_alumni')
      .select('*');

    if (q) {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,current_company.ilike.%${q}%`);
    }
    
    if (program) {
      query = query.eq('program', program);
    }
    
    if (graduationYear) {
      query = query.eq('graduation_year', parseInt(graduationYear));
    }
    
    if (location) {
      query = query.ilike('location_name', `%${location}%`);
    }

    const { data: alumni, error } = await query
      .order('last_active', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    const searchResults = alumni.map(alumni => ({
      id: alumni.id,
      name: `${alumni.first_name} ${alumni.last_name}`,
      graduationYear: alumni.graduation_year,
      program: alumni.program,
      location: {
        name: alumni.location_name,
        country: alumni.location_country,
        lat: alumni.location_lat,
        lon: alumni.location_lon
      },
      bio: alumni.bio,
      currentCompany: alumni.current_company,
      jobTitle: alumni.job_title,
      lastActive: alumni.last_active
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