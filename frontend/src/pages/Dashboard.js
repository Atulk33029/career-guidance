import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import { Compass, Brain, BookOpen, FileText, TrendingUp, Award, ChevronRight } from 'lucide-react';

const streamColors = { PCM: '#3b82f6', PCB: '#10b981', Commerce: '#f59e0b', Arts: '#8b5cf6' };

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/history').catch(() => ({ data: [] })),
      API.get('/test/results').catch(() => ({ data: [] }))
    ]).then(([h, r]) => {
      setHistory(h.data.slice(0, 5));
      setResults(r.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/stream', icon: Compass, label: 'Explore by Stream', color: '#3b82f6', desc: 'Browse courses & exams' },
    { to: '/careers', icon: Brain, label: 'Get Recommendations', color: '#f59e0b', desc: 'AI-powered career match' },
    { to: '/exams', icon: BookOpen, label: 'Competitive Exams', color: '#10b981', desc: 'JEE, NEET, CLAT & more' },
    { to: '/test', icon: FileText, label: 'Take Aptitude Test', color: '#8b5cf6', desc: 'Find your ideal career' },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '2rem', color: '#f8fafc' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
              {user?.stream ? `You're on the ${user.stream} track. Let's explore your options.` : 'Start by selecting your stream to get personalized guidance.'}
            </p>
          </div>
          {user?.stream && (
            <span style={{
              marginLeft: 'auto', padding: '0.5rem 1.25rem', borderRadius: '100px',
              background: `${streamColors[user.stream]}18`, border: `1px solid ${streamColors[user.stream]}40`,
              color: streamColors[user.stream], fontWeight: 700, fontSize: '1rem', fontFamily: 'Syne,sans-serif'
            }}>{user.stream}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {quickLinks.map(({ to, icon: Icon, label, color, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem',
              transition: 'all 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{desc}</div>
              </div>
              <ChevronRight size={16} color={color} />
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#f59e0b" /> Recent Recommendations
            </h2>
            <Link to="/careers" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.8rem' }}>View all →</Link>
          </div>
          {loading ? <div style={{ color: '#475569', fontSize: '0.875rem' }}>Loading...</div>
          : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Brain size={36} color="#1e293b" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: '#475569', fontSize: '0.875rem' }}>No recommendations yet</p>
              <Link to="/careers" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.825rem', display: 'block', marginTop: '0.5rem' }}>Get first recommendation →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((rec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#1e293b', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#f8fafc' }}>{rec.suggested_career}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.15rem' }}>{new Date(rec.created_at).toLocaleDateString()}</div>
                  </div>
                  <span style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: rec.score >= 70 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: rec.score >= 70 ? '#10b981' : '#f59e0b' }}>{rec.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#8b5cf6" /> Aptitude Test History
            </h2>
            <Link to="/results" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '0.8rem' }}>View all →</Link>
          </div>
          {loading ? <div style={{ color: '#475569', fontSize: '0.875rem' }}>Loading...</div>
          : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <FileText size={36} color="#1e293b" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: '#475569', fontSize: '0.875rem' }}>No tests taken yet</p>
              <Link to="/test" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '0.825rem', display: 'block', marginTop: '0.5rem' }}>Take aptitude test →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.map((r, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: '#1e293b', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.85rem', color: '#f8fafc' }}>{r.stream} Test</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: r.percentage >= 70 ? '#10b981' : r.percentage >= 40 ? '#f59e0b' : '#ef4444' }}>{r.percentage}%</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#8b5cf6' }}>{r.career_suggestion}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>{r.score}/{r.total} correct</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!user?.stream && (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '0.25rem' }}>⚠️ Complete Your Profile</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Select your stream to get personalized career recommendations</div>
          </div>
          <Link to="/stream" style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#000', fontWeight: 600, fontSize: '0.875rem' }}>Select Stream</Link>
        </div>
      )}
    </div>
  );
}
