const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// Simple admin check (in production, use proper role-based system)
const adminCheck = (req, res, next) => {
  authMiddleware(req, res, () => {
    // For demo: first user is admin, or check by email
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@careerguidance.com').split(',');
    if (!adminEmails.includes(req.user.email) && req.user.id !== 1) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

// === COURSES CRUD ===
router.get('/courses', adminCheck, async (req, res) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY stream, name');
  res.json(result.rows);
});

router.post('/courses', adminCheck, async (req, res) => {
  const { name, stream, duration, description, salary_range, top_colleges, career_scope } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO courses (name,stream,duration,description,salary_range,top_colleges,career_scope) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, stream, duration, description, salary_range, top_colleges, career_scope]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/courses/:id', adminCheck, async (req, res) => {
  const { name, stream, duration, description, salary_range, top_colleges, career_scope } = req.body;
  try {
    const r = await pool.query(
      `UPDATE courses SET name=$1,stream=$2,duration=$3,description=$4,salary_range=$5,top_colleges=$6,career_scope=$7 WHERE id=$8 RETURNING *`,
      [name, stream, duration, description, salary_range, top_colleges, career_scope, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/courses/:id', adminCheck, async (req, res) => {
  await pool.query('DELETE FROM courses WHERE id=$1', [req.params.id]);
  res.json({ message: 'Course deleted' });
});

// === EXAMS CRUD ===
router.get('/exams', adminCheck, async (req, res) => {
  const result = await pool.query('SELECT * FROM exams ORDER BY stream, name');
  res.json(result.rows);
});

router.post('/exams', adminCheck, async (req, res) => {
  const { name, eligibility, stream, description, exam_date, official_website, difficulty } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO exams (name,eligibility,stream,description,exam_date,official_website,difficulty) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, eligibility, stream, description, exam_date, official_website, difficulty]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/exams/:id', adminCheck, async (req, res) => {
  const { name, eligibility, stream, description, exam_date, official_website, difficulty } = req.body;
  try {
    const r = await pool.query(
      `UPDATE exams SET name=$1,eligibility=$2,stream=$3,description=$4,exam_date=$5,official_website=$6,difficulty=$7 WHERE id=$8 RETURNING *`,
      [name, eligibility, stream, description, exam_date, official_website, difficulty, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/exams/:id', adminCheck, async (req, res) => {
  await pool.query('DELETE FROM exams WHERE id=$1', [req.params.id]);
  res.json({ message: 'Exam deleted' });
});

// === QUESTIONS CRUD ===
router.get('/questions', adminCheck, async (req, res) => {
  const result = await pool.query('SELECT * FROM questions ORDER BY stream, category');
  res.json(result.rows);
});

router.post('/questions', adminCheck, async (req, res) => {
  const { question, options, correct_answer, stream, category } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO questions (question,options,correct_answer,stream,category) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [question, JSON.stringify(options), correct_answer, stream, category]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/questions/:id', adminCheck, async (req, res) => {
  const { question, options, correct_answer, stream, category } = req.body;
  try {
    const r = await pool.query(
      `UPDATE questions SET question=$1,options=$2,correct_answer=$3,stream=$4,category=$5 WHERE id=$6 RETURNING *`,
      [question, JSON.stringify(options), correct_answer, stream, category, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/questions/:id', adminCheck, async (req, res) => {
  await pool.query('DELETE FROM questions WHERE id=$1', [req.params.id]);
  res.json({ message: 'Question deleted' });
});

// === STATS ===
router.get('/stats', adminCheck, async (req, res) => {
  try {
    const [users, courses, exams, tests, recs] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(stream) as with_stream FROM users'),
      pool.query('SELECT COUNT(*) as total FROM courses'),
      pool.query('SELECT COUNT(*) as total FROM exams'),
      pool.query('SELECT COUNT(*) as total, AVG(percentage) as avg_score FROM test_results'),
      pool.query('SELECT COUNT(*) as total FROM recommendations'),
    ]);
    res.json({
      users: users.rows[0],
      courses: courses.rows[0],
      exams: exams.rows[0],
      tests: tests.rows[0],
      recommendations: recs.rows[0]
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET all users
router.get('/users', adminCheck, async (req, res) => {
  const result = await pool.query('SELECT id,name,email,stream,interests,created_at FROM users ORDER BY created_at DESC');
  res.json(result.rows);
});

module.exports = router;
