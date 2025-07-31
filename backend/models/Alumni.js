const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const alumniSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  
  // UWCCR Information
  graduationYear: {
    type: Number,
    required: true,
    min: 1950,
    max: new Date().getFullYear() + 5
  },
  program: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Other']
  },
  
  // Location Information
  location: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lon: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  
  // Privacy Settings
  isPublic: {
    type: Boolean,
    default: false
  },
  showLocation: {
    type: Boolean,
    default: true
  },
  showEmail: {
    type: Boolean,
    default: false
  },
  
  // Profile Information
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  currentCompany: {
    type: String,
    maxlength: 100,
    default: ''
  },
  jobTitle: {
    type: String,
    maxlength: 100,
    default: ''
  },
  
  // System Fields
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
alumniSchema.index({ email: 1 });
alumniSchema.index({ 'location.lat': 1, 'location.lon': 1 });
alumniSchema.index({ graduationYear: 1 });
alumniSchema.index({ program: 1 });

// Hash password before saving
alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
alumniSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (for map display)
alumniSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    graduationYear: this.graduationYear,
    program: this.program,
    location: this.showLocation ? this.location : null,
    bio: this.bio,
    currentCompany: this.showEmail ? this.currentCompany : null,
    jobTitle: this.showEmail ? this.jobTitle : null,
    lastActive: this.lastActive
  };
};

// Method to get full profile (for authenticated user)
alumniSchema.methods.getFullProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    graduationYear: this.graduationYear,
    program: this.program,
    location: this.location,
    bio: this.bio,
    currentCompany: this.currentCompany,
    jobTitle: this.jobTitle,
    isPublic: this.isPublic,
    showLocation: this.showLocation,
    showEmail: this.showEmail,
    isVerified: this.isVerified,
    lastActive: this.lastActive,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Alumni', alumniSchema); 