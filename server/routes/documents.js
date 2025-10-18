const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Use a generic filename, will be renamed after auth if needed
    const userId = req.user?.id || 'temp';
    cb(null, `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés: JPG, PNG, PDF, DOC, DOCX'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Get user's documents
router.get('/my-documents', authenticateToken, async (req, res) => {
  try {
    const documents = await query(`
      SELECT 
        id,
        user_id,
        document_type,
        filename,
        original_name,
        file_path,
        file_size,
        mime_type,
        status,
        uploaded_at
      FROM user_documents
      WHERE user_id = ?
      ORDER BY uploaded_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
});

// Upload a document (simplified version without database storage)
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    console.log('📤 Upload attempt:', req.file ? 'File received' : 'No file');
    console.log('📤 Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return just the filename for now (simpler approach)
    const filename = req.file.filename;
    console.log('✅ File uploaded successfully:', filename);
    
    res.json({
      success: true,
      data: {
        filename: filename,
        url: `/uploads/documents/${filename}`,
        path: req.file.path
      },
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Upload document error:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up file after error');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

// Download a document
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [document] = await query(
      'SELECT * FROM user_documents WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(document.file_path, document.original_name);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
});

// Delete a document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [document] = await query(
      'SELECT * FROM user_documents WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // Delete database record
    await query('DELETE FROM user_documents WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
});

module.exports = router;
