import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { ExternalLink, Search, Filter } from 'lucide-react';

const streams = ['All', 'PCM', 'PCB', 'Commerce', 'Arts'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const diffColor = { Hard: '#ef4444', Medium: '#f59e0b', Easy: '#10b981' };

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streamFilter, setStreamFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/exams').then(r => setExams(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = exams.filter(e => {
    const matchStream = streamFilter === 'All' || e.stream === streamFilter;
    const matchDiff = diffFilter === 'All' || e.difficulty === diffFilter;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase());
    return matchStream && matchDiff && matchSearch;
  });

  const chipStyle = (active) => ({
    padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', border: `1px solid ${active ? '#f59e0b' : '#1e293b'}`,
    background: active ? 'rgba(245,158,11,0.15)' : '#1e293b',
    color: active ? '#f59e0b' : '#64748b', transition: 'all 0.2s'
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#f8fafc' }}>Competitive Exams</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>All major Indian entrance and competitive examinations in one place</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input className="input" placeholder="Search exams..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stream</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {streams.map(s => (
                <span key={s} style={chipStyle(streamFilter === s)} onClick={() => setStreamFilter(s)}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {difficulties.map(d => (
                <span key={d} style={chipStyle(diffFilter === d)} onClick={() => setDiffFilter(d)}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Count */}
      <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Showing <strong style={{ color: '#94a3b8' }}>{filtered.length}</strong> exams
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#475569' }}>Loading exams...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map(exam => (
            <div key={exam.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem', flex: 1 }}>{exam.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                  {exam.stream && (
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '100px',
                      background: 'rgba(59,130,246,0.1)', color: '#3b82f6'
                    }}>{exam.stream}</span>
                  )}
                  {exam.difficulty && (
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '100px',
                      background: `${diffColor[exam.difficulty]}15`, color: diffColor[exam.difficulty]
                    }}>{exam.difficulty}</span>
                  )}
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '1rem' }}>{exam.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem' }}>
                  <span style={{ color: '#475569' }}>📋 Eligibility: </span>
                  <span style={{ color: '#94a3b8' }}>{exam.eligibility}</span>
                </div>
                {exam.exam_date && (
                  <div style={{ fontSize: '0.8rem' }}>
                    <span style={{ color: '#475569' }}>📅 Schedule: </span>
                    <span style={{ color: '#94a3b8' }}>{exam.exam_date}</span>
                  </div>
                )}
              </div>

              {exam.official_website && (
                <a href={exam.official_website} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  color: '#f59e0b', padding: '0.4rem 0.9rem', borderRadius: '8px',
                  fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s'
                }}>
                  Official Website <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: '#475569' }}>No exams found for your filters</p>
          <button className="btn-secondary" style={{ marginTop: '1rem' }}
            onClick={() => { setStreamFilter('All'); setDiffFilter('All'); setSearch(''); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
