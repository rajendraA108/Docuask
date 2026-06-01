const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  askQuestion,
  uploadMiddleware,
  getHistory,
  deleteQuery
} = require('../controllers/query.controller');

// All routes require authentication
router.use(protect);

// uploadMiddleware handles multipart/form-data, then askQuestion runs
router.post('/ask', uploadMiddleware, askQuestion);
router.get('/history', getHistory);
router.delete('/:id', deleteQuery);

module.exports = router;
