const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// GET questions by stream
router.get('/questions', authMiddleware, async (req, res) => {
  const { stream } = req.query;
  if (!stream) return res.status(400).json({ error: 'Stream required' });

  try {
    const result = await pool.query(
      'SELECT id, question, options, category FROM questions WHERE stream=$1 ORDER BY RANDOM() LIMIT 10',
      [stream]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST submit test
router.post('/submit', authMiddleware, async (req, res) => {
  const { stream, answers } = req.body;
  // answers: [{ questionId, selectedOption }]

  if (!stream || !answers) return res.status(400).json({ error: 'Stream and answers required' });

  try {
    // Get correct answers
    const ids = answers.map(a => a.questionId);
    const result = await pool.query(
      `SELECT id, correct_answer FROM questions WHERE id = ANY($1)`,
      [ids]
    );

    const correctMap = {};
    result.rows.forEach(r => { correctMap[r.id] = r.correct_answer; });

    let score = 0;
    const detailed = answers.map(a => {
      const isCorrect = correctMap[a.questionId] === a.selectedOption;
      if (isCorrect) score++;
      return { ...a, isCorrect, correctAnswer: correctMap[a.questionId] };
    });

    const total = answers.length;
    const percentage = (score / total) * 100;

    // Map score to career suggestion
    let careerSuggestion;
    const streamCareerMap = {
      PCM: [
        { min: 80, career: 'IIT/NIT Engineering (JEE Advanced level)' },
        { min: 60, career: 'Engineering / B.Tech at good colleges' },
        { min: 40, career: 'B.Sc in Physics/Maths or Diploma Engineering' },
        { min: 0, career: 'Polytechnic / ITI Courses' }
      ],
      PCB: [
        { min: 80, career: 'MBBS at AIIMS / Top Government Medical College' },
        { min: 60, career: 'MBBS / BDS / BAMS via NEET' },
        { min: 40, career: 'B.Pharm / B.Sc Nursing / Allied Health' },
        { min: 0, career: 'D.Pharm / Lab Technician Courses' }
      ],
      Commerce: [
        { min: 80, career: 'CA / CS / MBA at top institutes' },
        { min: 60, career: 'CA Foundation / BBA / B.Com Honours' },
        { min: 40, career: 'B.Com General / Banking Diploma' },
        { min: 0, career: 'Vocational Commerce Courses' }
      ],
      Arts: [
        { min: 80, career: 'CLAT for NLU / UPSC Civil Services' },
        { min: 60, career: 'BA Hons / Journalism / Psychology' },
        { min: 40, career: 'BA General / Creative Arts / Design' },
        { min: 0, career: 'Vocational Arts / Skill Development Courses' }
      ]
    };

    const tiers = streamCareerMap[stream] || streamCareerMap.PCM;
    for (const tier of tiers) {
      if (percentage >= tier.min) {
        careerSuggestion = tier.career;
        break;
      }
    }

    // Save result
    const saved = await pool.query(
      `INSERT INTO test_results (user_id, stream, score, total, percentage, career_suggestion, answers) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, created_at`,
      [req.user.id, stream, score, total, percentage, careerSuggestion, JSON.stringify(detailed)]
    );

    res.json({
      score, total, percentage: percentage.toFixed(1),
      careerSuggestion,
      detailedAnswers: detailed,
      resultId: saved.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET test results for user
router.get('/results', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, stream, score, total, percentage, career_suggestion, created_at FROM test_results WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single result
router.get('/results/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM test_results WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Result not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
