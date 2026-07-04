import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePhotoUrl: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['USER', 'MANAGER', 'TECHNICIAN', 'ADMIN'],
      default: 'USER',
      required: true,
    },
    firebaseUid: {
      type: String,
      trim: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ['google', 'microsoft', 'email', 'local'],
      default: 'local',
    },
    photo: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    notificationPreferences: {
      type: String,
      enum: ['EMAIL', 'IN_APP', 'BOTH', 'NONE'],
      default: 'BOTH',
    },
    language: {
      type: String,
      trim: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'ON_LEAVE'],
      default: 'AVAILABLE',
    },
    skills: [{ type: String, trim: true }],
    specialization: {
      type: String,
      trim: true,
    },
    certification: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 80,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
