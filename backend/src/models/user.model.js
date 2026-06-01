const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This is your first real MongoDB schema — notice the validation, indexing, and methods
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,          // Creates a MongoDB index automatically
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false          // Never return password in queries by default
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving — this runs automatically before every save()
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password changed
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method — available on every user document
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
