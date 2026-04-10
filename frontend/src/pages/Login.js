import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020817', padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.08), transparent)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.4rem', color: '#000', fontFamily: 'Syne, sans-serif',
            margin: '0 auto 1.25rem'
          }}>CG</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', color: '#f8fafc' }}>Welcome back</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '2rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem',
              color: '#ef4444', fontSize: '0.875rem'
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
              <input className="input" type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ marginBottom: '1.75rem', position: 'relative' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
              <input className="input" type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '1rem', top: '2.25rem',
                background: 'none', border: 'none', color: '#475569', cursor: 'pointer'
              }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
