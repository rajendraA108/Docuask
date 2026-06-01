const multer = require('multer');
const pdfParse = require('pdf-parse');
const { uploadToBlob } = require('../services/blob.service');
const { askAI } = require('../services/ai.service');
const Query = require('../models/query.model');

// Multer config — store file in memory (not on disk) before sending to Azure
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

exports.uploadMiddleware = upload.single('file');

/**
 * POST /api/queries/ask
 * Accepts: multipart/form-data with 'file' (PDF) and 'question' (string)
 * Flow: Upload to Azure → Extract text → Ask AI → Save to MongoDB → Respond
 */
exports.askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'PDF file is required.' });
    if (!question?.trim()) return res.status(400).json({ error: 'Question is required.' });

    // Step 1: Upload PDF to Azure Blob Storage
    const blobUrl = await uploadToBlob(file.buffer, file.originalname, file.mimetype);

    // Step 2: Extract text from PDF
    const pdfData = await pdfParse(file.buffer);
    const documentText = pdfData.text;

    if (!documentText.trim()) {
      return res.status(422).json({ error: 'Could not extract text from this PDF. It may be image-only.' });
    }

    // Step 3: Ask the AI
    const { answer, tokensUsed } = await askAI(documentText, question);

    // Step 4: Save to MongoDB for history
    const queryRecord = await Query.create({
      userId: req.user._id,
      fileName: file.originalname,
      blobUrl,
      question: question.trim(),
      answer,
      tokensUsed
    });

    // Step 5: Respond
    res.status(201).json({
      id: queryRecord._id,
      fileName: file.originalname,
      question: queryRecord.question,
      answer,
      createdAt: queryRecord.createdAt
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/queries/history
 * Returns the logged-in user's Q&A history — uses MongoDB aggregation pipeline
 */
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Aggregation pipeline — your first real MongoDB aggregation!
    const [result] = await Query.aggregate([
      { $match: { userId: req.user._id } },           // Filter by user
      { $sort: { createdAt: -1 } },                   // Newest first
      {
        $facet: {                                      // Run two queries at once
          data: [{ $skip: skip }, { $limit: limit }], // Paginated results
          total: [{ $count: 'count' }]                // Total count
        }
      }
    ]);

    const total = result.total[0]?.count || 0;

    res.json({
      queries: result.data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/queries/:id
 */
exports.deleteQuery = async (req, res, next) => {
  try {
    const query = await Query.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id    // Ensure users can only delete their own records
    });

    if (!query) return res.status(404).json({ error: 'Query not found.' });

    res.json({ message: 'Deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
