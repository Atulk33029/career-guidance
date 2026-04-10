const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// GET stream-based careers, courses, exams
router.get('/stream-careers', authMiddleware, async (req, res) => {
  const { stream } = req.query;
  if (!stream) return res.status(400).json({ error: 'Stream required' });

  try {
    const [courses, exams, careers] = await Promise.all([
      pool.query('SELECT * FROM courses WHERE stream=$1 ORDER BY name', [stream]),
      pool.query('SELECT * FROM exams WHERE stream=$1 OR stream IS NULL ORDER BY name', [stream]),
      pool.query('SELECT * FROM careers WHERE stream=$1 ORDER BY title', [stream]),
    ]);

    res.json({
      stream,
      courses: courses.rows,
      exams: exams.rows,
      careers: careers.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST recommend-career (rule-based + scoring engine)
router.post('/recommend-career', authMiddleware, async (req, res) => {
  const { stream, interests = [], skills = [] } = req.body;

  try {
    const result = await pool.query('SELECT * FROM careers WHERE stream=$1', [stream]);
    const careers = result.rows;

    // Scoring Engine
    const scored = careers.map(career => {
      let score = 0;
      const careerInterests = career.interests || [];
      const careerSkills = career.skills || [];

      // Interest match (40 points max)
      const interestMatches = interests.filter(i => careerInterests.includes(i)).length;
      score += (interestMatches / Math.max(careerInterests.length, 1)) * 40;

      // Skills match (40 points max)
      const skillMatches = skills.filter(s => careerSkills.includes(s)).length;
      score += (skillMatches / Math.max(careerSkills.length, 1)) * 40;

      // Stream bonus (20 points)
      if (career.stream === stream) score += 20;

      return { ...career, score: Math.round(score) };
    });

    const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);

    // Save to recommendations
    for (const career of top5) {
      await pool.query(
        'INSERT INTO recommendations (user_id, suggested_career, score, stream) VALUES ($1,$2,$3,$4)',
        [req.user.id, career.title, career.score, stream]
      );
    }

    // Update user profile with stream if not set
    await pool.query(
      'UPDATE users SET stream=COALESCE(stream,$1), interests=COALESCE(interests,$2), skills=COALESCE(skills,$3) WHERE id=$4',
      [stream, interests, skills, req.user.id]
    );

    res.json({ recommendations: top5 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all courses
router.get('/courses', authMiddleware, async (req, res) => {
  const { stream } = req.query;
  try {
    const result = stream
      ? await pool.query('SELECT * FROM courses WHERE stream=$1 ORDER BY name', [stream])
      : await pool.query('SELECT * FROM courses ORDER BY stream, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all exams
router.get('/exams', authMiddleware, async (req, res) => {
  const { stream } = req.query;
  try {
    const result = stream
      ? await pool.query('SELECT * FROM exams WHERE stream=$1 OR stream IS NULL ORDER BY name', [stream])
      : await pool.query('SELECT * FROM exams ORDER BY stream, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET career roadmap
router.get('/career/:id/roadmap', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM careers WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Career not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET user recommendations history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recommendations WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
