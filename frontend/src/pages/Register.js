import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const streams = ['PCM', 'PCB', 'Commerce', 'Arts'];
const interestOptions = ['tech', 'biology', 'business', 'creativity', 'law', 'social', 'research', 'finance', 'analytics', 'healthcare', 'communication', 'programming'];
const skillOptions = ['analytical', 'communication', 'problem-solving', 'creativity', 'leadership', 'teamwork', 'technical', 'writing'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', stream: '', interests: [], skills: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggle = (field, val) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter(v => v !== val) : [...prev[field], val]
    }));
  };

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setStep(1);
    } finally { setLoading(false); }
  };

  const chipStyle = (active, color = '#f59e0b') => ({
    display: 'inline-flex', alignItems: 'center', padding: '0.4rem 0.9rem',
    borderRadius: '100px', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 500,
    border: `1px solid ${active ? color : '#1e293b'}`,
    background: active ? `${color}18` : 'transparent',
    color: active ? color : '#64748b', transition: 'all 0.2s', margin: '0.25rem',
    userSelect: 'none'
  });

  const streamColors = { PCM: '#3b82f6', PCB: '#10b981', Commerce: '#f59e0b', Arts: '#8b5cf6' };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020817', padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.08), transparent)'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.4rem', color: '#000', fontFamily: 'Syne, sans-serif',
            margin: '0 auto 1.25rem'
          }}>CG</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', color: '#f8fafc' }}>Create Account</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Step {step} of 3</p>
        </div>

        <div style={{ height: '4px', background: '#1e293b', borderRadius: '2px', marginBottom: '1.5rem' }}>
          <div style={{
            height: '100%', borderRadius: '2px', transition: 'width 0.4s ease',
            width: `${(step / 3) * 100}%`,
            background: 'linear-gradient(90deg, #f59e0b, #f97316)'
          }} />
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '2rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem',
              color: '#ef4444', fontSize: '0.875rem'
            }}>{error}</div>
          )}

          {step === 1 && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Full Name *</label>
                <input className="input" placeholder="Your full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email *</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1.75rem', position: 'relative' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password *</label>
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '1rem', top: '2.25rem',
                  background: 'none', border: 'none', color: '#475569', cursor: 'pointer'
                }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button className="btn-primary" style={{ width: '100%' }}
                onClick={() => { if (!form.name || !form.email || !form.password) { setError('All fields required'); return; } setError(''); setStep(2); }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Select your Class 12 stream:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {streams.map(s => (
                  <div key={s} onClick={() => setForm({ ...form, stream: s })} style={{
                    padding: '1.25rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                    border: `2px solid ${form.stream === s ? streamColors[s] : '#1e293b'}`,
                    background: form.stream === s ? `${streamColors[s]}12` : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Syne,sans-serif', color: streamColors[s] }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" style={{ flex: 2 }}
                  onClick={() => { if (!form.stream) { setError('Please select a stream'); return; } setError(''); setStep(3); }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}>Your Interests</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {interestOptions.map(i => (
                    <span key={i} style={chipStyle(form.interests.includes(i))} onClick={() => toggle('interests', i)}>{i}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}>Your Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skillOptions.map(s => (
                    <span key={s} style={chipStyle(form.skills.includes(s), '#8b5cf6')} onClick={() => toggle('skills', s)}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" style={{ flex: 2, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <UserPlus size={16} /> {loading ? 'Creating...' : 'Create Account'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
