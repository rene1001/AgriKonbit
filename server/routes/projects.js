const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireFarmer, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'validated', category, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Correction: Permettre de récupérer tous les projets si aucun statut n'est spécifié
    let whereClause = status ? 'WHERE p.status = ?' : 'WHERE 1=1';
    let params = status ? [status] : [];

    if (category) {
      whereClause += ' AND p.category = ?';
      params.push(category);
    }

    const projects = await query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.budget_usd,
        p.budget_gyt,
        p.duration_days,
        p.estimated_return_pct,
        p.location,
        p.category,
        p.status,
        p.funded_amount_usd,
        p.funded_amount_gyt,
        p.investor_count,
        p.start_date,
        p.end_date,
        CAST(p.images AS CHAR) as images,
        p.created_at,
        u.full_name as farmer_name,
        u.country as farmer_country,
        ROUND((p.funded_amount_gyt / p.budget_gyt) * 100, 2) as funding_percentage
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM projects p
      ${whereClause}
    `, params);

    // Parse images JSON string for each project
    const projectsWithParsedImages = projects.map(project => ({
      ...project,
      images: project.images ? JSON.parse(project.images) : []
    }));

    res.json({
      success: true,
      data: {
        projects: projectsWithParsedImages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const projects = await query(`
      SELECT 
        p.id,
        p.farmer_id,
        p.title,
        p.description,
        p.budget_usd,
        p.budget_gyt,
        p.duration_days,
        p.estimated_return_pct,
        p.location,
        p.latitude,
        p.longitude,
        p.category,
        p.status,
        p.funded_amount_usd,
        p.funded_amount_gyt,
        p.investor_count,
        p.start_date,
        p.end_date,
        CAST(p.images AS CHAR) as images,
        CAST(p.documents AS CHAR) as documents,
        p.admin_notes,
        p.created_at,
        p.updated_at,
        u.full_name as farmer_name,
        u.country as farmer_country,
        u.city as farmer_city,
        ROUND((p.funded_amount_gyt / p.budget_gyt) * 100, 2) as funding_percentage
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projects[0];

    // Parse images and documents JSON strings
    project.images = project.images ? JSON.parse(project.images) : [];
    project.documents = project.documents ? JSON.parse(project.documents) : [];

    // Get project updates
    const updates = await query(`
      SELECT * FROM project_updates 
      WHERE project_id = ? AND is_public = true
      ORDER BY created_at DESC
    `, [id]);

    // Get investors (if project is active or completed)
    let investors = [];
    if (['active', 'completed'].includes(project.status)) {
      investors = await query(`
        SELECT 
          i.amount_gyt,
          i.amount_usd,
          i.return_type,
          i.physical_return_qty,
          i.physical_return_unit,
          i.created_at,
          u.full_name as investor_name
        FROM investments i
        JOIN users u ON i.investor_id = u.id
        WHERE i.project_id = ? AND i.status = 'completed'
        ORDER BY i.created_at DESC
      `, [id]);
    }

    res.json({
      success: true,
      data: {
        ...project,
        updates,
        investors
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Create project (farmer only)
router.post('/', authenticateToken, requireFarmer, [
  body('title').trim().isLength({ min: 5, max: 255 }),
  body('description').trim().isLength({ min: 50 }),
  body('budgetUsd').isDecimal({ decimal_digits: '0,2' }),
  body('durationDays').isInt({ min: 30, max: 3650 }),
  body('estimatedReturnPct').isDecimal({ decimal_digits: '0,2' }),
  body('location').trim().isLength({ min: 3 }),
  body('category').isIn(['crops', 'livestock', 'fishing', 'forestry', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      budgetUsd,
      durationDays,
      estimatedReturnPct,
      location,
      latitude,
      longitude,
      category,
      images,
      documents
    } = req.body;

    // Convert USD to GYT (1:1 for now)
    const budgetGyt = budgetUsd;

    const result = await query(`
      INSERT INTO projects (
        farmer_id, title, description, budget_usd, budget_gyt,
        duration_days, estimated_return_pct, location, latitude, longitude,
        category, images, documents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, title, description, budgetUsd, budgetGyt,
      durationDays, estimatedReturnPct, location, latitude || null, longitude || null,
      category, JSON.stringify(images || []), JSON.stringify(documents || [])
    ]);

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: {
        projectId: result.insertId
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// Update project (farmer only)
router.put('/:id', authenticateToken, requireFarmer, [
  body('title').optional().trim().isLength({ min: 5, max: 255 }),
  body('description').optional().trim().isLength({ min: 50 }),
  body('location').optional().trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if project exists and belongs to user
    const projects = await query(
      'SELECT id, status FROM projects WHERE id = ? AND farmer_id = ?',
      [id, req.user.id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projects[0];

    if (project.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update project that is not pending'
      });
    }

    // Build update query with allowed fields only
    const allowedFields = ['title', 'description', 'location', 'latitude', 'longitude', 'images', 'documents'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await query(`
      UPDATE projects 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    res.json({
      success: true,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// Get farmer's projects
router.get('/farmer/my-projects', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE farmer_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const projects = await query(`
      SELECT 
        *,
        ROUND((funded_amount_gyt / budget_gyt) * 100, 2) as funding_percentage
      FROM projects
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM projects
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get farmer projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Add project update (farmer only)
router.post('/:id/updates', authenticateToken, requireFarmer, [
  body('title').trim().isLength({ min: 5, max: 255 }),
  body('content').trim().isLength({ min: 20 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, content, images, isPublic = true } = req.body;

    // Check if project exists and belongs to user
    const projects = await query(
      'SELECT id FROM projects WHERE id = ? AND farmer_id = ?',
      [id, req.user.id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const result = await query(`
      INSERT INTO project_updates (project_id, title, content, images, is_public)
      VALUES (?, ?, ?, ?, ?)
    `, [id, title, content, JSON.stringify(images || []), isPublic]);

    res.status(201).json({
      success: true,
      message: 'Project update added successfully',
      data: {
        updateId: result.insertId
      }
    });

  } catch (error) {
    console.error('Add project update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project update'
    });
  }
});

module.exports = router;
