require('dotenv').config();
const { pool, createTables } = require('./db');

const seedData = async () => {
  await createTables();
  const client = await pool.connect();

  try {
    // Seed Courses
    await client.query(`DELETE FROM courses`);
    const courses = [
      // PCM Courses
      ['B.Tech Computer Science', 'PCM', '4 years', 'Bachelor of Technology in Computer Science covers programming, algorithms, AI, and software engineering.', '₹4L - ₹25L/year', '{IIT Bombay, IIT Delhi, BITS Pilani, NIT Trichy}', 'Excellent scope in IT, startups, FAANG companies'],
      ['B.Tech Mechanical Engineering', 'PCM', '4 years', 'Study of machines, thermodynamics, manufacturing, and design.', '₹3.5L - ₹15L/year', '{IIT Madras, NIT Warangal, VIT Vellore}', 'Core industries, automotive, aerospace'],
      ['B.Sc Mathematics', 'PCM', '3 years', 'Pure and applied mathematics including calculus, algebra, and statistics.', '₹3L - ₹12L/year', '{DU, BHU, Presidency College}', 'Academia, data science, finance'],
      ['B.Arch Architecture', 'PCM', '5 years', 'Design and construction of buildings combining art and engineering.', '₹4L - ₹18L/year', '{SPA Delhi, IIT Roorkee, CEPT Ahmedabad}', 'Urban planning, real estate, design firms'],
      ['B.Tech Electronics & Communication', 'PCM', '4 years', 'Electronics circuits, signal processing, telecommunications.', '₹3.5L - ₹15L/year', '{IIT Kharagpur, NIT Calicut, NSIT Delhi}', 'VLSI, telecom, defense R&D'],
      // PCB Courses
      ['MBBS', 'PCB', '5.5 years', 'Bachelor of Medicine and Surgery — the gateway to becoming a doctor.', '₹8L - ₹30L/year', '{AIIMS Delhi, JIPMER, CMC Vellore}', 'Government hospitals, private practice, research'],
      ['B.Sc Nursing', 'PCB', '4 years', 'Healthcare nursing with clinical training in hospitals.', '₹3L - ₹10L/year', '{AIIMS, SNDT, Manipal}', 'Hospitals, clinics, abroad opportunities'],
      ['B.Pharm Pharmacy', 'PCB', '4 years', 'Study of drugs, pharmacology, and pharmaceutical sciences.', '₹3.5L - ₹12L/year', '{JSS Mysore, Manipal, Bombay College of Pharmacy}', 'Pharma industry, drug stores, R&D'],
      ['BDS Dental Surgery', 'PCB', '5 years', 'Dental medicine and oral surgery training.', '₹6L - ₹20L/year', '{Manipal, KLE, Saveetha}', 'Dental clinics, hospitals, research'],
      ['B.Sc Biotechnology', 'PCB', '3 years', 'Biological sciences applied to technology, genetics, and molecular biology.', '₹3L - ₹10L/year', '{JNU, Hyderabad Central, Amity}', 'Research labs, biotech firms, academia'],
      // Commerce Courses
      ['B.Com General', 'Commerce', '3 years', 'Business, accounting, finance, and economics fundamentals.', '₹3L - ₹10L/year', '{SRCC Delhi, Christ Bangalore, Loyola Chennai}', 'Banking, finance, entrepreneurship'],
      ['CA (Chartered Accountant)', 'Commerce', '4-5 years', 'Professional accounting qualification with taxation, audit, and financial reporting.', '₹8L - ₹30L/year', '{ICAI affiliated firms}', 'Big 4 firms, corporate finance, self-practice'],
      ['BBA Business Administration', 'Commerce', '3 years', 'Management, marketing, HR, and business strategy.', '₹4L - ₹15L/year', '{IIM Indore IPM, NMIMS, Symbiosis}', 'MBA gateway, corporate management'],
      ['B.Sc Economics', 'Commerce', '3 years', 'Microeconomics, macroeconomics, econometrics, and policy analysis.', '₹4L - ₹18L/year', '{SRCC, LSR, Presidency}', 'Policy research, banking, consulting'],
      // Arts Courses
      ['BA Psychology', 'Arts', '3 years', 'Study of human behavior, mental processes, counseling, and therapy.', '₹3L - ₹12L/year', '{DU, Christ, Fergusson}', 'Counseling, HR, research, clinical practice'],
      ['BA Mass Communication', 'Arts', '3 years', 'Journalism, media production, advertising, and public relations.', '₹3L - ₹12L/year', '{IIMC, Symbiosis, AJK MCRC}', 'Media houses, PR firms, digital content'],
      ['LLB Law', 'Arts', '3-5 years', 'Legal education covering constitutional, criminal, and civil law.', '₹5L - ₹25L/year', '{NLU Delhi, NALSAR, NLU Bangalore}', 'Courts, law firms, corporate legal'],
      ['B.Des Design', 'Arts', '4 years', 'Product, graphic, fashion, or UX design training.', '₹4L - ₹20L/year', '{NID, NIFT, IIT Bombay IDC}', 'Design studios, product companies, freelance'],
    ];
    for (const c of courses) {
      await client.query(
        `INSERT INTO courses (name, stream, duration, description, salary_range, top_colleges, career_scope) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        c
      );
    }

    // Seed Exams
    await client.query(`DELETE FROM exams`);
    const exams = [
      ['JEE Main', 'Class 12 PCM with 75% aggregate', 'PCM', 'Joint Entrance Examination for NITs, IIITs, and CFTIs.', 'Jan & Apr annually', 'https://jeemain.nta.nic.in', 'Hard'],
      ['JEE Advanced', 'Top 2.5L JEE Main qualifiers', 'PCM', 'Premier exam for IIT admissions across India.', 'May annually', 'https://jeeadv.ac.in', 'Hard'],
      ['BITSAT', 'Class 12 PCM with 75%', 'PCM', 'BITS Pilani entrance for engineering and science programs.', 'May-June annually', 'https://www.bitsadmission.com', 'Hard'],
      ['GATE', 'B.Tech/BE graduate', 'PCM', 'Graduate Aptitude Test for M.Tech admissions and PSU jobs.', 'Feb annually', 'https://gate.iitb.ac.in', 'Hard'],
      ['NEET UG', 'Class 12 PCB with 50%', 'PCB', 'National Eligibility cum Entrance Test for MBBS/BDS/BAMS admissions.', 'May annually', 'https://neet.nta.nic.in', 'Hard'],
      ['AIIMS MBBS', 'Class 12 PCB with 60%', 'PCB', 'Entrance exam specifically for AIIMS medical colleges.', 'Merged with NEET', 'https://www.aiimsexams.ac.in', 'Hard'],
      ['CA Foundation', '10+2 pass any stream', 'Commerce', 'First level of Chartered Accountancy course by ICAI.', 'May & Nov annually', 'https://icai.org', 'Medium'],
      ['CLAT', 'Class 12 any stream 45%', 'Arts', 'Common Law Admission Test for NLU law programs.', 'Dec annually', 'https://consortiumofnlus.ac.in', 'Medium'],
      ['CUET', 'Class 12 any stream', 'Arts', 'Common University Entrance Test for central university admissions.', 'May annually', 'https://cuet.samarth.ac.in', 'Medium'],
      ['NDA', 'Class 12 PCM (male) 16.5-19.5 yrs', 'PCM', 'National Defence Academy entrance for Army, Navy, Air Force.', 'Apr & Sep annually', 'https://upsc.gov.in', 'Hard'],
      ['SSC CGL', 'Graduate any stream', 'Commerce', 'Staff Selection Commission Combined Graduate Level for government jobs.', 'Mar-Apr annually', 'https://ssc.nic.in', 'Medium'],
      ['NIFT Entrance', 'Class 12 any stream', 'Arts', 'National Institute of Fashion Technology entrance exam.', 'Feb annually', 'https://nift.ac.in', 'Medium'],
    ];
    for (const e of exams) {
      await client.query(
        `INSERT INTO exams (name, eligibility, stream, description, exam_date, official_website, difficulty) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        e
      );
    }

    // Seed Careers
    await client.query(`DELETE FROM careers`);
    const careers = [
      {
        title: 'Software Engineer', stream: 'PCM', interests: ['tech','programming'], skills: ['analytical','problem-solving'],
        description: 'Design, develop, and maintain software applications and systems.',
        avg_salary: '₹6L - ₹40L/year', growth_rate: '25% (Very High)',
        roadmap: JSON.stringify([
          { year: 'Year 1-4', milestone: 'B.Tech CS/IT', desc: 'Core CS fundamentals, DSA, OOP' },
          { year: 'Year 4-5', milestone: 'Internships & Projects', desc: 'Build portfolio, contribute to open source' },
          { year: 'Year 5+', milestone: 'Junior Developer', desc: 'Join product/service company' },
          { year: 'Year 7+', milestone: 'Senior Engineer', desc: 'Lead projects, mentor juniors' },
          { year: 'Year 10+', milestone: 'Tech Lead / Architect', desc: 'System design, team leadership' }
        ])
      },
      {
        title: 'Data Scientist', stream: 'PCM', interests: ['tech','analytics'], skills: ['analytical','problem-solving'],
        description: 'Analyze large datasets to extract insights and build predictive ML models.',
        avg_salary: '₹7L - ₹35L/year', growth_rate: '35% (Exceptional)',
        roadmap: JSON.stringify([
          { year: 'Year 1-4', milestone: 'B.Tech CS/Stats/Math', desc: 'Statistics, Python, ML basics' },
          { year: 'Year 4-5', milestone: 'Specialization', desc: 'ML, Deep Learning, NLP projects' },
          { year: 'Year 5+', milestone: 'Junior Data Scientist', desc: 'Industry datasets, model deployment' },
          { year: 'Year 7+', milestone: 'Senior Data Scientist', desc: 'Research papers, team lead' }
        ])
      },
      {
        title: 'Doctor (MBBS+MD)', stream: 'PCB', interests: ['biology','healthcare'], skills: ['analytical','communication'],
        description: 'Diagnose and treat patients in hospitals, clinics, or specialized practice.',
        avg_salary: '₹8L - ₹50L/year', growth_rate: '15% (Steady)',
        roadmap: JSON.stringify([
          { year: 'Year 1-5.5', milestone: 'MBBS', desc: 'Medical school, clinical rotations' },
          { year: 'Year 6', milestone: 'Internship', desc: 'Rotational hospital training' },
          { year: 'Year 7-10', milestone: 'MD/MS Specialization', desc: 'Post-graduation in specialty' },
          { year: 'Year 10+', milestone: 'Consultant', desc: 'Independent practice or hospital consultant' }
        ])
      },
      {
        title: 'Chartered Accountant', stream: 'Commerce', interests: ['business','finance'], skills: ['analytical','problem-solving'],
        description: 'Handle taxation, auditing, financial planning and reporting for firms.',
        avg_salary: '₹8L - ₹30L/year', growth_rate: '12% (Stable)',
        roadmap: JSON.stringify([
          { year: 'Year 1', milestone: 'CA Foundation', desc: 'After Class 12, register with ICAI' },
          { year: 'Year 2-3', milestone: 'CA Intermediate', desc: 'Articleship begins, 8 papers' },
          { year: 'Year 4-5', milestone: 'CA Final', desc: 'Advanced papers + 3 year articleship' },
          { year: 'Year 5+', milestone: 'Qualified CA', desc: 'Big 4, corporates, or self-practice' }
        ])
      },
      {
        title: 'UX/UI Designer', stream: 'Arts', interests: ['creativity','tech'], skills: ['creativity','communication'],
        description: 'Design intuitive digital interfaces and user experiences for apps and websites.',
        avg_salary: '₹4L - ₹20L/year', growth_rate: '20% (High)',
        roadmap: JSON.stringify([
          { year: 'Year 1-4', milestone: 'B.Des / BFA', desc: 'Design principles, tools like Figma' },
          { year: 'Year 4-5', milestone: 'Internship & Portfolio', desc: 'Build case studies, freelance projects' },
          { year: 'Year 5+', milestone: 'Junior UX Designer', desc: 'Join product team or agency' },
          { year: 'Year 7+', milestone: 'Lead Designer', desc: 'Design system ownership' }
        ])
      },
      {
        title: 'Lawyer / Advocate', stream: 'Arts', interests: ['law','social','communication'], skills: ['communication','analytical'],
        description: 'Represent clients in legal matters, draft contracts, and provide legal counsel.',
        avg_salary: '₹5L - ₹30L/year', growth_rate: '10% (Stable)',
        roadmap: JSON.stringify([
          { year: 'Year 1-5', milestone: 'LLB (5-year integrated)', desc: 'Law school, moot courts, internships' },
          { year: 'Year 5-6', milestone: 'Bar Council Enrollment', desc: 'Register as advocate' },
          { year: 'Year 6-10', milestone: 'Junior Advocate', desc: 'Work under senior, build cases' },
          { year: 'Year 10+', milestone: 'Senior Advocate / Partner', desc: 'Own practice or law firm' }
        ])
      },
      {
        title: 'Biotechnologist', stream: 'PCB', interests: ['biology','research'], skills: ['analytical','problem-solving'],
        description: 'Apply biological research to develop medicines, vaccines, and biotech products.',
        avg_salary: '₹4L - ₹15L/year', growth_rate: '18% (Growing)',
        roadmap: JSON.stringify([
          { year: 'Year 1-3', milestone: 'B.Sc Biotechnology', desc: 'Molecular biology, genetics, lab skills' },
          { year: 'Year 3-5', milestone: 'M.Sc / M.Tech Biotech', desc: 'Specialization, research thesis' },
          { year: 'Year 5+', milestone: 'Research Scientist', desc: 'Pharma, biotech, or CSIR labs' },
          { year: 'Year 8+', milestone: 'Senior Researcher / PhD', desc: 'Lead research projects' }
        ])
      },
      {
        title: 'Digital Marketing Manager', stream: 'Commerce', interests: ['business','creativity','tech'], skills: ['communication','creativity'],
        description: 'Plan and execute online marketing campaigns across SEO, social media, and ads.',
        avg_salary: '₹4L - ₹18L/year', growth_rate: '22% (High)',
        roadmap: JSON.stringify([
          { year: 'Year 1-3', milestone: 'BBA / B.Com + Certifications', desc: 'Google Ads, Meta Blueprint, SEO' },
          { year: 'Year 3-5', milestone: 'Executive / Analyst', desc: 'Run campaigns, analytics' },
          { year: 'Year 5+', milestone: 'Manager', desc: 'Lead team, strategy, budgets' }
        ])
      },
    ];
    for (const c of careers) {
      await client.query(
        `INSERT INTO careers (title, stream, interests, skills, description, avg_salary, growth_rate, roadmap) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [c.title, c.stream, c.interests, c.skills, c.description, c.avg_salary, c.growth_rate, c.roadmap]
      );
    }

    // Seed MCQ Questions
    await client.query(`DELETE FROM questions`);
    const questions = [
      // PCM Questions
      { q: 'What is the derivative of sin(x)?', opts: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'], ans: 0, stream: 'PCM', cat: 'Mathematics' },
      { q: 'Which law states F = ma?', opts: ["Newton's 1st", "Newton's 2nd", "Newton's 3rd", "Ohm's Law"], ans: 1, stream: 'PCM', cat: 'Physics' },
      { q: 'What is the valency of Carbon?', opts: ['2', '4', '6', '8'], ans: 1, stream: 'PCM', cat: 'Chemistry' },
      { q: 'What does CPU stand for?', opts: ['Central Process Unit', 'Central Processing Unit', 'Computer Processing Unit', 'Core Processing Unit'], ans: 1, stream: 'PCM', cat: 'Technology' },
      { q: 'Which sorting algorithm has O(n log n) average complexity?', opts: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], ans: 2, stream: 'PCM', cat: 'Technology' },
      { q: 'The speed of light is approximately?', opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], ans: 1, stream: 'PCM', cat: 'Physics' },
      // PCB Questions
      { q: 'The powerhouse of the cell is?', opts: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], ans: 2, stream: 'PCB', cat: 'Biology' },
      { q: 'Which blood type is universal donor?', opts: ['A+', 'B+', 'O-', 'AB+'], ans: 2, stream: 'PCB', cat: 'Biology' },
      { q: 'DNA stands for?', opts: ['Deoxyribonucleic Acid', 'Dioxynucleic Acid', 'Dinucleotide Acid', 'Diribonucleic Acid'], ans: 0, stream: 'PCB', cat: 'Biology' },
      { q: 'Which organ produces insulin?', opts: ['Liver', 'Kidney', 'Pancreas', 'Spleen'], ans: 2, stream: 'PCB', cat: 'Biology' },
      { q: 'NEET exam is required for admission to?', opts: ['Engineering', 'Medical', 'Law', 'Management'], ans: 1, stream: 'PCB', cat: 'General' },
      { q: 'Which molecule carries oxygen in red blood cells?', opts: ['Globulin', 'Hemoglobin', 'Albumin', 'Fibrinogen'], ans: 1, stream: 'PCB', cat: 'Biology' },
      // Commerce Questions
      { q: 'GDP stands for?', opts: ['Gross Domestic Product', 'General Domestic Production', 'Gross Direct Product', 'General Direct Product'], ans: 0, stream: 'Commerce', cat: 'Economics' },
      { q: 'What is the full form of GST?', opts: ['General Sales Tax', 'Goods and Services Tax', 'Government Sales Tax', 'Gross Service Tax'], ans: 1, stream: 'Commerce', cat: 'Accounts' },
      { q: 'Which body regulates the stock market in India?', opts: ['RBI', 'SEBI', 'TRAI', 'FSSAI'], ans: 1, stream: 'Commerce', cat: 'Finance' },
      { q: 'A balance sheet shows?', opts: ['Revenue & Expenses', 'Assets & Liabilities', 'Cash flows', 'Profit & Loss'], ans: 1, stream: 'Commerce', cat: 'Accounts' },
      { q: 'REPO rate is set by?', opts: ['SEBI', 'Finance Ministry', 'RBI', 'NABARD'], ans: 2, stream: 'Commerce', cat: 'Economics' },
      { q: 'What does IPO stand for?', opts: ['Initial Public Offering', 'International Payment Order', 'Initial Private Order', 'Internal Public Offering'], ans: 0, stream: 'Commerce', cat: 'Finance' },
      // Arts Questions
      { q: 'Who wrote the Indian Constitution?', opts: ['Jawaharlal Nehru', 'Sardar Patel', 'B.R. Ambedkar', 'Mahatma Gandhi'], ans: 2, stream: 'Arts', cat: 'Political Science' },
      { q: 'Sigmund Freud is known for developing?', opts: ['Cognitive Therapy', 'Psychoanalysis', 'Behaviorism', 'Humanism'], ans: 1, stream: 'Arts', cat: 'Psychology' },
      { q: 'The Renaissance originated in which country?', opts: ['France', 'England', 'Italy', 'Germany'], ans: 2, stream: 'Arts', cat: 'History' },
      { q: 'Article 370 was related to?', opts: ['Freedom of Speech', 'Jammu & Kashmir', 'Right to Education', 'SC/ST reservations'], ans: 1, stream: 'Arts', cat: 'Political Science' },
      { q: 'CLAT exam is for admission to?', opts: ['Medical Colleges', 'Law Schools', 'Engineering Colleges', 'Management Schools'], ans: 1, stream: 'Arts', cat: 'General' },
      { q: 'Who wrote "Wings of Fire"?', opts: ['Narendra Modi', 'A.P.J. Abdul Kalam', 'Amartya Sen', 'Vikram Seth'], ans: 1, stream: 'Arts', cat: 'General' },
    ];
    for (const q of questions) {
      await client.query(
        `INSERT INTO questions (question, options, correct_answer, stream, category) VALUES ($1,$2,$3,$4,$5)`,
        [q.q, JSON.stringify(q.opts), q.ans, q.stream, q.cat]
      );
    }

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
};

seedData();
