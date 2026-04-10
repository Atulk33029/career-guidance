# 🎓 Career Guidance Platform for Students After 12th

A full-stack, production-ready web application that recommends career paths, courses, and competitive exams based on a student's stream and interests.

---

## 🗂️ Project Structure

```
career-guidance/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── db.js               # PostgreSQL connection + table creation
│   │   └── seed.js             # Database seeding with sample data
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js             # /api/auth/* endpoints
│   │   ├── careers.js          # /api/* career/exam/course endpoints
│   │   ├── test.js             # /api/test/* aptitude test endpoints
│   │   └── admin.js            # /api/admin/* admin CRUD endpoints
│   ├── server.js               # Express app entry point
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # React.js app
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state + axios instance
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation bar
│   │   ├── pages/
│   │   │   ├── Landing.js      # Public landing page
│   │   │   ├── Login.js        # Authentication
│   │   │   ├── Register.js     # 3-step registration wizard
│   │   │   ├── Dashboard.js    # User dashboard
│   │   │   ├── StreamSelection.js    # Browse by stream
│   │   │   ├── CareerRecommendations.js  # AI recommendations
│   │   │   ├── ExamsPage.js    # Competitive exams
│   │   │   ├── AptitudeTest.js # MCQ test engine
│   │   │   ├── TestResults.js  # Results + PDF export
│   │   │   └── AdminPanel.js   # Admin CRUD panel
│   │   ├── App.js
│   │   └── index.css           # Global styles + design system
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml          # Full-stack Docker setup
```

---

## 🏗️ Database Schema

### users
| Column     | Type         | Description                   |
|------------|--------------|-------------------------------|
| id         | SERIAL PK    | Auto-increment ID             |
| name       | VARCHAR(100) | Full name                     |
| email      | VARCHAR(150) | Unique email                  |
| password   | VARCHAR(255) | Bcrypt hashed password        |
| stream     | VARCHAR(20)  | PCM / PCB / Commerce / Arts   |
| interests  | TEXT[]       | Array of interest tags        |
| skills     | TEXT[]       | Array of skill tags           |
| created_at | TIMESTAMP    | Registration timestamp        |

### courses
| Column      | Type         | Description               |
|-------------|--------------|---------------------------|
| id          | SERIAL PK    | Auto-increment ID         |
| name        | VARCHAR(200) | Course name               |
| stream      | VARCHAR(20)  | Target stream             |
| duration    | VARCHAR(50)  | e.g. "4 years"            |
| description | TEXT         | Full description          |
| salary_range| VARCHAR(100) | e.g. "₹4L - ₹20L/year"   |
| top_colleges| TEXT[]       | Array of college names    |
| career_scope| TEXT         | Job market overview       |

### exams
| Column           | Type         | Description            |
|------------------|--------------|------------------------|
| id               | SERIAL PK    |                        |
| name             | VARCHAR(200) | Exam name              |
| eligibility      | TEXT         | Who can apply          |
| stream           | VARCHAR(20)  | Target stream          |
| description      | TEXT         | Exam overview          |
| exam_date        | VARCHAR(100) | When it's held         |
| official_website | VARCHAR(255) | URL                    |
| difficulty       | VARCHAR(20)  | Easy / Medium / Hard   |

### careers
| Column      | Type         | Description                     |
|-------------|--------------|----------------------------------|
| id          | SERIAL PK    |                                  |
| title       | VARCHAR(200) | Career title                    |
| stream      | VARCHAR(20)  | PCM / PCB / Commerce / Arts     |
| interests   | TEXT[]       | Matching interest tags          |
| skills      | TEXT[]       | Matching skill tags             |
| description | TEXT         | Career overview                 |
| avg_salary  | VARCHAR(100) | Salary range                    |
| growth_rate | VARCHAR(50)  | Market growth %                 |
| roadmap     | JSONB        | Array of {year, milestone, desc}|

### recommendations
| Column          | Type         | Description        |
|-----------------|--------------|--------------------|
| id              | SERIAL PK    |                    |
| user_id         | INT FK       | References users   |
| suggested_career| VARCHAR(200) | Career title       |
| score           | NUMERIC      | 0-100 match score  |
| stream          | VARCHAR(20)  |                    |
| created_at      | TIMESTAMP    |                    |

### questions
| Column         | Type     | Description                  |
|----------------|----------|------------------------------|
| id             | SERIAL PK|                              |
| question       | TEXT     | Question text                |
| options        | JSONB    | Array of 4 option strings    |
| correct_answer | INTEGER  | Index of correct option (0-3)|
| stream         | VARCHAR  | PCM / PCB / Commerce / Arts  |
| category       | VARCHAR  | Maths, Biology, etc.         |

### test_results
| Column            | Type     | Description              |
|-------------------|----------|--------------------------|
| id                | SERIAL PK|                          |
| user_id           | INT FK   | References users         |
| stream            | VARCHAR  |                          |
| score             | INTEGER  | Correct answers          |
| total             | INTEGER  | Total questions          |
| percentage        | NUMERIC  | Score %                  |
| career_suggestion | VARCHAR  | Recommended career path  |
| answers           | JSONB    | Detailed answer review   |
| created_at        | TIMESTAMP|                          |

---

## 🔌 API Reference

### Authentication
| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | /api/auth/register    | No   | Register new user        |
| POST   | /api/auth/login       | No   | Login and get JWT token  |
| GET    | /api/auth/profile     | Yes  | Get logged-in user info  |
| PUT    | /api/auth/profile     | Yes  | Update stream/interests  |

### Careers & Recommendations
| Method | Endpoint                      | Auth | Description                        |
|--------|-------------------------------|------|------------------------------------|
| GET    | /api/stream-careers?stream=PCM| Yes  | Get careers, courses, exams by stream |
| POST   | /api/recommend-career         | Yes  | Get scored career recommendations  |
| GET    | /api/courses?stream=PCM       | Yes  | List all / filtered courses        |
| GET    | /api/exams?stream=PCM         | Yes  | List all / filtered exams          |
| GET    | /api/history                  | Yes  | User recommendation history        |

### Aptitude Test
| Method | Endpoint              | Auth | Description                  |
|--------|-----------------------|------|------------------------------|
| GET    | /api/test/questions?stream=PCM | Yes | Get 10 random MCQs   |
| POST   | /api/test/submit      | Yes  | Submit answers, get results  |
| GET    | /api/test/results     | Yes  | All user test results        |
| GET    | /api/test/results/:id | Yes  | Single detailed result       |

### Admin (User ID 1 only)
| Method | Endpoint              | Auth  | Description         |
|--------|-----------------------|-------|---------------------|
| GET    | /api/admin/stats      | Admin | Platform analytics  |
| GET    | /api/admin/users      | Admin | All registered users|
| CRUD   | /api/admin/courses    | Admin | Manage courses      |
| CRUD   | /api/admin/exams      | Admin | Manage exams        |
| CRUD   | /api/admin/questions  | Admin | Manage MCQ bank     |

---

## 🧠 Recommendation Engine Logic

```
Score = Stream Match (20pts) + Interest Match (40pts) + Skill Match (40pts)

Interest Score = (matching interests / career's interests) × 40
Skill Score    = (matching skills / career's skills) × 40
Stream Score   = 20 if stream matches, else 0

Top 5 careers by score are returned
```

**Rule-based examples:**
- `PCM + tech + analytical` → Software Engineer (Score: ~90)
- `PCB + healthcare + empathy` → Doctor (Score: ~90)
- `Commerce + finance + analytical` → Chartered Accountant (Score: ~90)
- `Arts + creativity + writing` → Journalist / Designer (Score: ~80)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm / yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials

# Create DB
createdb career_guidance

# Start server (auto-creates tables)
npm run dev

# Seed sample data
node config/seed.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

### Docker (Full Stack)
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub → Connect to Vercel
# Set: REACT_APP_API_URL=https://your-api.render.com/api
```

### Backend → Render / Railway
1. Create new Web Service
2. Connect GitHub repo, set root to `/backend`
3. Build: `npm install`
4. Start: `node server.js` (first run seeds DB)
5. Set environment variables from `.env.example`

### Database → Neon / Supabase / Railway PostgreSQL
- Get connection string
- Set `DATABASE_URL` in backend environment

---

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds 12
- **JWT Tokens**: 7-day expiry, signed with secret
- **Input Validation**: Server-side checks on all endpoints
- **CORS**: Configured for specific frontend origin
- **SQL Injection**: Protected via parameterised pg queries
- **Admin Check**: Email/ID based admin role verification

---

## 👤 Default Admin Account

Register with **ID 1** (first registered user) to access `/admin`

Or set `ADMIN_EMAILS=your@email.com` in backend `.env`

---

## 📦 Tech Stack Summary

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router 6, Axios     |
| Styling    | Custom CSS (Space Grotesk + Syne)   |
| Backend    | Node.js, Express.js                 |
| Database   | PostgreSQL (via pg driver)          |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Deployment | Vercel + Render + Neon/Supabase DB  |
| Container  | Docker + docker-compose             |
