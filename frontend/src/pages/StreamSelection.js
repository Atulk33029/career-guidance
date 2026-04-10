import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { BookOpen, FlaskConical, TrendingUp, Palette, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const streamConfig = {
  PCM: {
    icon: '⚛️', color: '#3b82f6', gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    label: 'Physics · Chemistry · Mathematics',
    desc: 'Engineering, Technology, Data Science, Architecture',
    tagline: 'Build the future with science and math'
  },
  PCB: {
    icon: '🧬', color: '#10b981', gradient: 'linear-gradient(135deg, #059669, #10b981)',
    label: 'Physics · Chemistry · Biology',
    desc: 'Medicine, Pharmacy, Biotechnology, Nursing',
    tagline: 'Save lives and advance healthcare'
  },
  Commerce: {
    icon: '📊', color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    label: 'Accountancy · Business Studies · Economics',
    desc: 'CA, MBA, Finance, Banking, Economics',
    tagline: 'Master business and financial world'
  },
  Arts: {
    icon: '🎨', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
    label: 'History · Political Science · Psychology · Languages',
    desc: 'Law, Design, Journalism, Civil Services',
    tagline: 'Shape society through creativity and thought'
  }
};

export default function StreamSelection() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('careers');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const navigate = useNavigate();

  const fetchStream = async (stream) => {
    setSelected(stream);
    setLoading(true);
    setData(null);
    try {
      const res = await API.get(`/stream-careers?stream=${stream}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (d) => d === 'Hard' ? '#ef4444' : d === 'Medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#f8fafc' }}>Explore by Stream</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Select your stream to discover careers, courses, and exams</p>
      </div>

      {/* Stream Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {Object.entries(streamConfig).map(([stream, cfg]) => (
          <div key={stream} onClick={() => fetchStream(stream)} style={{
            background: selected === stream ? `${cfg.color}15` : '#0f172a',
            border: `2px solid ${selected === stream ? cfg.color : '#1e293b'}`,
            borderRadius: '16px', padding: '1.5rem', cursor: 'pointer',
            transition: 'all 0.3s', textAlign: 'center',
            transform: selected === stream ? 'translateY(-3px)' : 'translateY(0)',
            boxShadow: selected === stream ? `0 8px 25px ${cfg.color}25` : 'none'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cfg.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.25rem', color: selected === stream ? cfg.color : '#f8fafc' }}>{stream}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem', lineHeight: 1.4 }}>{cfg.desc}</div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid #1e293b', borderTopColor: '#f59e0b',
            animation: 'spin 0.8s linear infinite', margin: '0 auto'
          }} />
          <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading {selected} data...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div>
          {/* Stream Header */}
          <div style={{
            background: `${streamConfig[selected].color}10`,
            border: `1px solid ${streamConfig[selected].color}30`,
            borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{streamConfig[selected].icon}</div>
              <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc' }}>{selected} Stream</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{streamConfig[selected].label}</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[['Courses', data.courses?.length], ['Careers', data.careers?.length], ['Exams', data.exams?.length]].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'Syne,sans-serif', fontWeight: 700, color: streamConfig[selected].color }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '0' }}>
            {['careers', 'courses', 'exams'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '0.75rem 1.5rem', background: 'none', border: 'none',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                color: activeTab === tab ? streamConfig[selected].color : '#64748b',
                borderBottom: activeTab === tab ? `2px solid ${streamConfig[selected].color}` : '2px solid transparent',
                transition: 'all 0.2s', textTransform: 'capitalize'
              }}>{tab}</button>
            ))}
          </div>

          {/* Careers Tab */}
          {activeTab === 'careers' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.careers?.map(career => (
                <div key={career.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 600, color: '#f8fafc', fontSize: '1rem' }}>{career.title}</h3>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {career.growth_rate}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{career.description}</p>
                  <div style={{ color: '#f59e0b', fontSize: '0.825rem', fontWeight: 600 }}>💰 {career.avg_salary}</div>
                  {career.roadmap && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roadmap</p>
                      {(typeof career.roadmap === 'string' ? JSON.parse(career.roadmap) : career.roadmap).map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '0.35rem',
                            background: streamConfig[selected].color
                          }} />
                          <div>
                            <span style={{ color: streamConfig[selected].color, fontSize: '0.75rem', fontWeight: 600 }}>{step.year}: </span>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{step.milestone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.courses?.map(course => (
                <div key={course.id} className="card" style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 600, color: '#f8fafc' }}>{course.name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>⏱ {course.duration}</span>
                        <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>💰 {course.salary_range}</span>
                      </div>
                    </div>
                    {expandedCourse === course.id ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
                  </div>
                  {expandedCourse === course.id && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{course.description}</p>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.4rem' }}><strong style={{ color: '#94a3b8' }}>Career Scope:</strong> {course.career_scope}</p>
                      {course.top_colleges && (
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                          <strong style={{ color: '#94a3b8' }}>Top Colleges:</strong> {Array.isArray(course.top_colleges) ? course.top_colleges.join(', ') : course.top_colleges}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.exams?.map(exam => (
                <div key={exam.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 600, color: '#f8fafc' }}>{exam.name}</h3>
                    {exam.difficulty && (
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px',
                        color: difficultyColor(exam.difficulty), background: `${difficultyColor(exam.difficulty)}15`
                      }}>{exam.difficulty}</span>
                    )}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{exam.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Eligibility: </span>{exam.eligibility}
                  </div>
                  {exam.exam_date && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b' }}>Schedule: </span>{exam.exam_date}
                    </div>
                  )}
                  {exam.official_website && (
                    <a href={exam.official_website} target="_blank" rel="noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      color: streamConfig[selected].color, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500
                    }}>
                      Official Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{
            marginTop: '2.5rem', textAlign: 'center', padding: '2rem',
            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '16px'
          }}>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Want personalised career recommendations based on your interests?</p>
            <button className="btn-primary" onClick={() => navigate('/careers')}>
              Get My Career Recommendations →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
