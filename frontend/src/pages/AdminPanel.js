import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { Plus, Pencil, Trash2, BarChart2, Users, BookOpen, FileText } from 'lucide-react';

const TABS = ['stats', 'courses', 'exams', 'questions', 'users'];

export default function AdminPanel() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const fetchData = async (t = tab) => {
    setLoading(true);
    try {
      if (t === 'stats') {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } else {
        const res = await API.get(`/admin/${t}`);
        setData(res.data);
      }
    } catch (e) {
      setError('Access denied or failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(tab); }, [tab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/admin/${tab}/${id}`);
      fetchData();
    } catch (e) { alert('Delete failed'); }
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await API.put(`/admin/${tab}/${editItem.id}`, formData);
      } else {
        await API.post(`/admin/${tab}`, formData);
      }
      setShowForm(false); setEditItem(null); setFormData({});
      fetchData();
    } catch (e) { alert('Save failed: ' + (e.response?.data?.error || e.message)); }
  };

  const openEdit = (item) => { setEditItem(item); setFormData(item); setShowForm(true); };
  const openAdd = () => { setEditItem(null); setFormData({}); setShowForm(true); };

  const tabStyle = (t) => ({
    padding: '0.6rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.875rem',
    color: tab === t ? '#f59e0b' : '#64748b',
    borderBottom: tab === t ? '2px solid #f59e0b' : '2px solid transparent', transition: 'all 0.2s'
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#f8fafc' }}>Admin Panel</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage platform content and view analytics</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#ef4444' }}>
          {error} — Make sure you're logged in as admin (user ID 1)
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #1e293b', marginBottom: '2rem', display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
        {TABS.map(t => <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
      </div>

      {loading && <div style={{ color: '#475569', padding: '2rem 0' }}>Loading...</div>}

      {/* Stats Tab */}
      {tab === 'stats' && stats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Users', value: stats.users?.total, sub: `${stats.users?.with_stream} with stream`, icon: Users, color: '#3b82f6' },
              { label: 'Courses', value: stats.courses?.total, sub: 'In database', icon: BookOpen, color: '#10b981' },
              { label: 'Exams', value: stats.exams?.total, sub: 'Listed', icon: FileText, color: '#8b5cf6' },
              { label: 'Tests Taken', value: stats.tests?.total, sub: `Avg: ${parseFloat(stats.tests?.avg_score || 0).toFixed(1)}%`, icon: BarChart2, color: '#f59e0b' },
              { label: 'Recommendations', value: stats.recommendations?.total, sub: 'Generated', icon: BarChart2, color: '#f97316' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#f8fafc' }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && !loading && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'Name', 'Email', 'Stream', 'Joined'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.875rem' }}>{u.id}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '0.875rem' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.875rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {u.stream && <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '100px' }}>{u.stream}</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Courses / Exams / Questions Tabs */}
      {['courses', 'exams', 'questions'].includes(tab) && !loading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button className="btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Add {tab.slice(0, -1)}
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc', marginBottom: '1.5rem' }}>
                  {editItem ? 'Edit' : 'Add'} {tab.slice(0, -1)}
                </h2>
                {tab === 'courses' && (
                  <>
                    {['name', 'stream', 'duration', 'salary_range', 'career_scope'].map(f => (
                      <div key={f} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'capitalize' }}>{f.replace('_', ' ')}</label>
                        <input className="input" value={formData[f] || ''} onChange={e => setFormData({ ...formData, [f]: e.target.value })} />
                      </div>
                    ))}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Description</label>
                      <textarea className="input" rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
                    </div>
                  </>
                )}
                {tab === 'exams' && (
                  <>
                    {['name', 'stream', 'eligibility', 'exam_date', 'official_website', 'difficulty'].map(f => (
                      <div key={f} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'capitalize' }}>{f.replace('_', ' ')}</label>
                        <input className="input" value={formData[f] || ''} onChange={e => setFormData({ ...formData, [f]: e.target.value })} />
                      </div>
                    ))}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Description</label>
                      <textarea className="input" rows={3} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
                    </div>
                  </>
                )}
                {tab === 'questions' && (
                  <>
                    {['stream', 'category'].map(f => (
                      <div key={f} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'capitalize' }}>{f}</label>
                        <input className="input" value={formData[f] || ''} onChange={e => setFormData({ ...formData, [f]: e.target.value })} />
                      </div>
                    ))}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Question</label>
                      <textarea className="input" rows={3} value={formData.question || ''} onChange={e => setFormData({ ...formData, question: e.target.value })} style={{ resize: 'vertical' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Options (comma-separated)</label>
                      <input className="input" value={Array.isArray(formData.options) ? formData.options.join(',') : formData.options || ''}
                        onChange={e => setFormData({ ...formData, options: e.target.value.split(',') })} placeholder="Option A, Option B, Option C, Option D" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Correct Answer Index (0-3)</label>
                      <input className="input" type="number" min="0" max="3" value={formData.correct_answer || 0}
                        onChange={e => setFormData({ ...formData, correct_answer: parseInt(e.target.value) })} />
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setShowForm(false); setEditItem(null); }}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Data table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name || item.question || 'Untitled'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {item.stream && <span style={{ marginRight: '0.75rem' }}>Stream: {item.stream}</span>}
                    {item.duration && <span style={{ marginRight: '0.75rem' }}>Duration: {item.duration}</span>}
                    {item.difficulty && <span>Difficulty: {item.difficulty}</span>}
                    {item.category && <span>Category: {item.category}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => openEdit(item)} style={{
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    color: '#3b82f6', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}><Pencil size={13} /> Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}><Trash2 size={13} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
