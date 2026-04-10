import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, BookOpen, Award, Sparkles, ChevronRight } from 'lucide-react';

const streams = [
  { name: 'PCM', desc: 'Engineering, Physics, Data Science', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { name: 'PCB', desc: 'Medicine, Pharmacy, Biotechnology', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'Commerce', desc: 'CA, MBA, Finance, Economics', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { name: 'Arts', desc: 'Law, Psychology, Design, Media', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
];

const features = [
  { icon: '🎯', title: 'Smart Recommendations', desc: 'AI-powered career matching based on your stream, interests and skills' },
  { icon: '📚', title: 'Course Database', desc: 'Comprehensive list of courses with colleges, duration and salary info' },
  { icon: '📝', title: 'Aptitude Testing', desc: 'Stream-specific MCQ tests that map your score to ideal career paths' },
  { icon: '🗺️', title: 'Career Roadmaps', desc: 'Step-by-step timelines for each career from 12th to success' },
  { icon: '🏆', title: 'Exam Guidance', desc: 'All competitive exams — JEE, NEET, CLAT, CA — in one place' },
  { icon: '📊', title: 'Progress Dashboard', desc: 'Track your exploration, test history and recommendations' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#020817', overflowX: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#000', fontFamily: 'Syne, sans-serif'
          }}>CG</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
            Career<span style={{ color: '#f59e0b' }}>Guide</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
            color: '#94a3b8', fontWeight: 500, fontSize: '0.9rem',
            border: '1px solid #1e293b', background: 'transparent',
            transition: 'all 0.2s'
          }}>Login</Link>
          <Link to="/register" style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: '#000', fontWeight: 600, fontSize: '0.9rem'
          }}>Get Started</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '8rem 2rem 4rem',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.12), transparent)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '2rem',
          fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500
        }}>
          <Sparkles size={14} />
          India's #1 Career Guidance Platform for Class 12 Students
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'Syne, sans-serif',
          fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem',
          maxWidth: '800px', color: '#f8fafc'
        }}>
          Your Future Starts With the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Right Career Choice</span>
        </h1>

        <p style={{
          fontSize: '1.15rem', color: '#94a3b8', maxWidth: '600px',
          marginBottom: '2.5rem', lineHeight: 1.7
        }}>
          Confused after 12th? Get personalized career recommendations based on your stream, 
          discover top courses, competitive exams, and a clear roadmap to success.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.9rem 2rem', borderRadius: '12px', textDecoration: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: '#000', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 8px 30px rgba(245,158,11,0.3)'
          }}>
            Start Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{
            padding: '0.9rem 2rem', borderRadius: '12px', textDecoration: 'none',
            border: '1px solid #1e293b', color: '#f8fafc', fontWeight: 600, fontSize: '1rem',
            background: 'rgba(255,255,255,0.03)'
          }}>
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center'
        }}>
          {[['500+', 'Career Paths'], ['100+', 'Courses Listed'], ['50+', 'Competitive Exams'], ['4', 'Major Streams']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#f59e0b' }}>{n}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Streams Section */}
      <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Syne,sans-serif', fontSize: '2.25rem', marginBottom: '0.75rem' }}>
          Which Stream Are You In?
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', fontSize: '1.05rem' }}>
          Get tailored guidance for your specific academic background
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {streams.map(s => (
            <Link to="/register" key={s.name} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0f172a', border: `1px solid ${s.color}30`,
                borderRadius: '16px', padding: '2rem', textAlign: 'center',
                transition: 'all 0.3s', cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '2rem', fontFamily: 'Syne,sans-serif', fontWeight: 800,
                  color: s.color, marginBottom: '0.75rem'
                }}>{s.name}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{s.desc}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                  marginTop: '1.25rem', color: s.color, fontSize: '0.85rem', fontWeight: 600
                }}>
                  Explore <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '5rem 2rem', background: '#0a0f1e', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Syne,sans-serif', fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            Everything You Need to Decide Your Career
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', fontSize: '1.05rem' }}>
            From stream selection to job-ready skills — we guide every step
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px',
                padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
              }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#f8fafc' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Ready to Find Your Path?
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.05rem' }}>
          Join thousands of students who've found clarity with CareerGuide
        </p>
        <Link to="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '1rem 2.5rem', borderRadius: '12px', textDecoration: 'none',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          color: '#000', fontWeight: 700, fontSize: '1.1rem',
          boxShadow: '0 8px 30px rgba(245,158,11,0.3)'
        }}>
          Get Started — It's Free <ArrowRight size={20} />
        </Link>
      </div>

      {/* Footer */}
      <div style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid #1e293b', color: '#475569', fontSize: '0.85rem' }}>
        © 2024 CareerGuide India. Empowering students to make informed career decisions.
      </div>
    </div>
  );
}
