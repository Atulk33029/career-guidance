import React, { useState } from 'react';
import { useAuth, API } from '../context/AuthContext';
import { Brain, TrendingUp, DollarSign, Map, Sparkles } from 'lucide-react';

const streams = ['PCM', 'PCB', 'Commerce', 'Arts'];
const interestOptions = [
  { val: 'tech', label: '💻 Technology' },
  { val: 'biology', label: '🧬 Biology' },
  { val: 'business', label: '📈 Business' },
  { val: 'creativity', label: '🎨 Creativity' },
  { val: 'law', label: '⚖️ Law' },
  { val: 'social', label: '🤝 Social Work' },
  { val: 'finance', label: '💰 Finance' },
  { val: 'research', label: '🔬 Research' },
  { val: 'healthcare', label: '🏥 Healthcare' },
  { val: 'analytics', label: '📊 Analytics' },
  { val: 'communication', label: '📢 Communication' },
  { val: 'programming', label: '👨‍💻 Programming' },
];
const skillOptions = [
  { val: 'analytical', label: '🧠 Analytical' },
  { val: 'communication', label: '🗣️ Communication' },
  { val: 'problem-solving', label: '🔧 Problem Solving' },
  { val: 'creativity', label: '✨ Creativity' },
  { val: 'leadership', label: '👑 Leadership' },
  { val: 'technical', label: '⚙️ Technical' },
  { val: 'empathy', label: '❤️ Empathy' },
  { val: 'writing', label: '✍️ Writing' },
];

export default function CareerRecommendations() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    stream: user?.stream || '',
    interests: user?.interests || [],
    skills: user?.skills || []
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
    }));
  };

  const handleSubmit = async () => {
    if (!form.stream) { setError('Please select your stream'); return; }
    setError(''); setLoading(true);
    try {
      const res = await API.post('/recommend-career', form);
      setRecommendations(res.data.recommendations);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to get recommendations');
    } finally { setLoading(false); }
  };

  const chipStyle = (active, color = '#f59e0b') => ({
    padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', border: `1px solid ${active ? color : '#1e293b'}`,
    background: active ? `${color}15` : '#1e293b',
    color: active ? color : '#64748b', transition: 'all 0.2s', userSelect: 'none',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
  });

  const scoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#3b82f6';
    return '#ef4444';
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#f8fafc' }}>
          Career Recommendations
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Tell us about yourself and we'll suggest the best careers using our smart matching engine
        </p>
      </div>

      {!recommendations ? (
        <div style={{ maxWidth: '680px' }}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', marginBottom: '1.25rem', color: '#f8fafc', fontSize: '1.1rem' }}>
              Step 1: Your Stream
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {streams.map(s => {
                const colors = { PCM: '#3b82f6', PCB: '#10b981', Commerce: '#f59e0b', Arts: '#8b5cf6' };
                return (
                  <span key={s} style={chipStyle(form.stream === s, colors[s])}
                    onClick={() => setForm({ ...form, stream: s })}>
                    {s}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', marginBottom: '0.5rem', color: '#f8fafc', fontSize: '1.1rem' }}>
              Step 2: Your Interests
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>Select all that resonate with you</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {interestOptions.map(({ val, label }) => (
                <span key={val} style={chipStyle(form.interests.includes(val))}
                  onClick={() => toggle('interests', val)}>{label}</span>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', marginBottom: '0.5rem', color: '#f8fafc', fontSize: '1.1rem' }}>
              Step 3: Your Skills
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>What are you naturally good at?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skillOptions.map(({ val, label }) => (
                <span key={val} style={chipStyle(form.skills.includes(val), '#8b5cf6')}
                  onClick={() => toggle('skills', val)}>{label}</span>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
              color: '#ef4444', fontSize: '0.875rem'
            }}>{error}</div>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1rem' }}>
            <Sparkles size={20} />
            {loading ? 'Analysing your profile...' : 'Get My Career Recommendations'}
          </button>

          {/* Rule-based logic info */}
          <div style={{ marginTop: '1.5rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.6 }}>
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>How it works:</span> Our engine scores careers based on
              stream match (20pts), interest alignment (40pts) and skill overlap (40pts).
              Top 5 careers by score are suggested for you.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc' }}>Your Top Career Matches</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Stream: <strong style={{ color: '#f59e0b' }}>{form.stream}</strong>
              </p>
            </div>
            <button className="btn-secondary" onClick={() => setRecommendations(null)}>← Start Over</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendations.map((career, i) => (
              <div key={career.id} className="card" style={{
                borderColor: i === 0 ? 'rgba(245,158,11,0.4)' : undefined,
                background: i === 0 ? 'rgba(245,158,11,0.05)' : undefined,
                position: 'relative', overflow: 'hidden'
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: '100px'
                  }}>⭐ BEST MATCH</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: `${scoreColor(career.score)}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne,sans-serif', fontWeight: 800, color: scoreColor(career.score),
                      fontSize: '0.85rem'
                    }}>#{i + 1}</div>
                    <div>
                      <h3 style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.1rem' }}>{career.title}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                        <span style={{ color: '#10b981', fontSize: '0.8rem' }}>📈 {career.growth_rate}</span>
                        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>💰 {career.avg_salary}</span>
                      </div>
                    </div>
                  </div>
                  {/* Score Circle */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      border: `3px solid ${scoreColor(career.score)}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: scoreColor(career.score) }}>{career.score}</span>
                      <span style={{ fontSize: '0.55rem', color: '#475569' }}>SCORE</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{career.description}</p>

                {/* Score bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ color: '#475569', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Match Score</span>
                  <div style={{ flex: 1, background: '#1e293b', borderRadius: '100px', height: '6px' }}>
                    <div style={{
                      height: '100%', borderRadius: '100px', background: `linear-gradient(90deg, ${scoreColor(career.score)}, ${scoreColor(career.score)}aa)`,
                      width: `${career.score}%`, transition: 'width 0.8s ease'
                    }} />
                  </div>
                  <span style={{ color: scoreColor(career.score), fontSize: '0.75rem', fontWeight: 700 }}>{career.score}%</span>
                </div>

                {/* Roadmap toggle */}
                {career.roadmap && (
                  <div>
                    <button onClick={() => setExpanded(expanded === career.id ? null : career.id)}
                      style={{
                        background: 'none', border: '1px solid #1e293b', color: '#94a3b8',
                        padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '0.8rem', fontFamily: 'Space Grotesk, sans-serif',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                      }}>
                      <Map size={14} /> {expanded === career.id ? 'Hide' : 'View'} Career Roadmap
                    </button>
                    {expanded === career.id && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '12px' }}>
                        {(typeof career.roadmap === 'string' ? JSON.parse(career.roadmap) : career.roadmap).map((step, si) => (
                          <div key={si} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{
                                width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0, marginTop: '0.3rem'
                              }} />
                              {si < (typeof career.roadmap === 'string' ? JSON.parse(career.roadmap) : career.roadmap).length - 1 && (
                                <div style={{ position: 'absolute', left: '4px', top: '14px', width: '2px', height: 'calc(100% + 4px)', background: '#1e293b' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>{step.year}</div>
                              <div style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 600 }}>{step.milestone}</div>
                              {step.desc && <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{step.desc}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setRecommendations(null)}>← Refine Preferences</button>
            <a href="/test" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Take Aptitude Test to Confirm →</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
