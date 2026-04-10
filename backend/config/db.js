const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/career_guidance',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        stream VARCHAR(20) CHECK (stream IN ('PCM','PCB','Commerce','Arts')),
        interests TEXT[],
        skills TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        stream VARCHAR(20) NOT NULL,
        duration VARCHAR(50),
        description TEXT,
        salary_range VARCHAR(100),
        top_colleges TEXT[],
        career_scope TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        eligibility TEXT,
        stream VARCHAR(20),
        description TEXT,
        exam_date VARCHAR(100),
        official_website VARCHAR(255),
        difficulty VARCHAR(20) CHECK (difficulty IN ('Easy','Medium','Hard')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS careers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        stream VARCHAR(20) NOT NULL,
        interests TEXT[],
        skills TEXT[],
        description TEXT,
        avg_salary VARCHAR(100),
        growth_rate VARCHAR(50),
        roadmap JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        suggested_career VARCHAR(200),
        score NUMERIC(5,2),
        stream VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer INTEGER NOT NULL,
        stream VARCHAR(20) NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS test_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        stream VARCHAR(20),
        score INTEGER,
        total INTEGER,
        percentage NUMERIC(5,2),
        career_suggestion VARCHAR(200),
        answers JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tables created successfully');
  } finally {
    client.release();
  }
};

module.exports = { pool, createTables };
