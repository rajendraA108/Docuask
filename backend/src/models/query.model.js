const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // Reference to User collection
      required: true,
      index: true            // Index for fast lookups by user
    },
    fileName: {
      type: String,
      required: true
    },
    blobUrl: {
      type: String,          // Azure Blob Storage URL
      required: true
    },
    question: {
      type: String,
      required: true,
      maxlength: [1000, 'Question too long']
    },
    answer: {
      type: String,
      required: true
    },
    tokensUsed: {
      type: Number,          // Track AI usage for cost monitoring
      default: 0
    }
  },
  {
    timestamps: true         // Adds createdAt and updatedAt automatically
  }
);

// Compound index — optimises "get all queries for this user, newest first"
querySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Query', querySchema);
