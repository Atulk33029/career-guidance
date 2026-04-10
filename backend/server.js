require('dotenv').config();
const express = require('express');

const { createTables } = require('./config/db');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/careers'));
app.use('/api/test', require('./routes/test'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'Career Guidance API is running' }));

// API Documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Career Guidance Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile (auth required)',
        'PUT /api/auth/profile': 'Update user profile (auth required)'
      },
      careers: {
        'GET /api/stream-careers?stream=PCM': 'Get careers, courses, exams by stream',
        'POST /api/recommend-career': 'Get AI-powered career recommendations',
        'GET /api/courses?stream=PCM': 'Get all courses',
        'GET /api/exams?stream=PCM': 'Get all exams',
        'GET /api/history': 'Get recommendation history'
      },
      test: {
        'GET /api/test/questions?stream=PCM': 'Get aptitude test questions',
        'POST /api/test/submit': 'Submit test answers',
        'GET /api/test/results': 'Get all test results',
        'GET /api/test/results/:id': 'Get single result'
      },
      admin: {
        'GET /api/admin/stats': 'Platform statistics',
        'CRUD /api/admin/courses': 'Manage courses',
        'CRUD /api/admin/exams': 'Manage exams',
        'CRUD /api/admin/questions': 'Manage questions'
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await createTables();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};
const cors = require('cors');

app.use(cors({
  origin: 'https://career-guidance-ougstzebu-atulk33029s-projects.vercel.app/'
}));

start();
