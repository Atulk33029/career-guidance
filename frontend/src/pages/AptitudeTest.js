import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const streams = ['PCM', 'PCB', 'Commerce', 'Arts'];

export default function AptitudeTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('select'); // select | test | submitting | done
  const [selectedStream, setSelectedStream] = useState(user?.stream || '');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const TOTAL_TIME = 10 * 60; // 10 minutes

  useEffect(() => {
    if (phase !== 'test') return;
    setTimeLeft(TOTAL_TIME);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'test' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const startTest = async () => {
    if (!selectedStream) return;
    setLoading(true);
    try {
      const res = await API.get(`/test/questions?stream=${selectedStream}`);
      setQuestions(res.data);
      setAnswers({});
      setCurrent(0);
      setPhase('test');
    } catch (e) {
      alert('Failed to load questions');
    } finally { setLoading(false); }
  };

  const handleSubmit = useCallback(async () => {
    if (phase === 'submitting') return;
    setPhase('submitting');
    const formattedAnswers = Object.entries(answers).map(([qId, selected]) => ({
      questionId: parseInt(qId),
      selectedOption: selected
    }));
    try {
      const res = await API.post('/test/submit', {
        stream: selectedStream,
        answers: formattedAnswers
      });
      setResult(res.data);
      setPhase('done');
    } catch (e) {
      alert('Failed to submit test');
      setPhase('test');
    }
  }, [answers, selectedStream, phase]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const progress = questions.length ? (Object.keys(answers).length / questions.length) * 100 : 0;

  // Select Stream Phase
  if (phase === 'select') {
    return (
      <div className="page-container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#f8fafc', marginBottom: '0.5rem' }}>Aptitude Test</h1>
          <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>
            Take a 10-question stream-specific test to discover your strengths and ideal career paths
          </p>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {[['📝', '10 Questions'], ['⏱', '10 Minutes'], ['🎯', 'Instant Results'], ['📊', 'Career Mapping']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', align: 'center', gap: '0.4rem' }}>
                  <span>{icon}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{label}</span>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#f8fafc', marginBottom: '1rem', fontFamily: 'Syne,sans-serif', fontSize: '1rem' }}>
              Select Your Stream
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {streams.map(s => {
                const colors = { PCM: '#3b82f6', PCB: '#10b981', Commerce: '#f59e0b', Arts: '#8b5cf6' };
                const icons = { PCM: '⚛️', PCB: '🧬', Commerce: '📊', Arts: '🎨' };
                const active = selectedStream === s;
                return (
                  <div key={s} onClick={() => setSelectedStream(s)} style={{
                    padding: '1rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                    border: `2px solid ${active ? colors[s] : '#1e293b'}`,
                    background: active ? `${colors[s]}10` : '#0f172a', transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{icons[s]}</div>
                    <div style={{ fontWeight: 600, color: active ? colors[s] : '#94a3b8' }}>{s}</div>
                  </div>
                );
              })}
            </div>

            <button className="btn-primary" onClick={startTest} disabled={!selectedStream || loading}
              style={{ width: '100%', fontSize: '1rem', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? 'Loading questions...' : <>Start Test <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test Phase
  if (phase === 'test' && questions.length > 0) {
    const q = questions[current];
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    const answered = answers[q.id] !== undefined;
    const isLast = current === questions.length - 1;
    const allAnswered = Object.keys(answers).length === questions.length;
    const isLowTime = timeLeft <= 60;

    return (
      <div className="page-container" style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc' }}>{selectedStream} Aptitude Test</h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Question {current + 1} of {questions.length}</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: isLowTime ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
            border: `1px solid ${isLowTime ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
            padding: '0.5rem 1rem', borderRadius: '10px'
          }}>
            <Clock size={16} color={isLowTime ? '#ef4444' : '#f59e0b'} />
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: isLowTime ? '#ef4444' : '#f59e0b' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: '#1e293b', borderRadius: '100px', height: '6px', marginBottom: '2rem' }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            background: 'linear-gradient(90deg, #f59e0b, #f97316)',
            width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s'
          }} />
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          {q.category && (
            <span style={{
              display: 'inline-block', marginBottom: '1rem',
              background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
              fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: '100px'
            }}>{q.category}</span>
          )}
          <p style={{ color: '#f8fafc', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 500 }}>
            {q.question}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {opts.map((opt, i) => {
              const isSelected = answers[q.id] === i;
              return (
                <div key={i} onClick={() => setAnswers({ ...answers, [q.id]: i })}
                  style={{
                    padding: '0.9rem 1.1rem', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${isSelected ? '#f59e0b' : '#1e293b'}`,
                    background: isSelected ? 'rgba(245,158,11,0.08)' : '#1e293b',
                    color: isSelected ? '#f59e0b' : '#94a3b8',
                    fontWeight: isSelected ? 600 : 400, transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${isSelected ? '#f59e0b' : '#475569'}`,
                    background: isSelected ? '#f59e0b' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#000' : '#475569'
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {questions.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
                background: answers[questions[i].id] !== undefined ? '#f59e0b' : i === current ? '#1e293b' : '#0f172a',
                border: `2px solid ${i === current ? '#f59e0b' : answers[questions[i].id] !== undefined ? '#f59e0b' : '#1e293b'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                color: answers[questions[i].id] !== undefined ? '#000' : '#475569'
              }}>{i + 1}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {current > 0 && (
              <button className="btn-secondary" onClick={() => setCurrent(c => c - 1)} style={{ padding: '0.5rem 1rem' }}>← Prev</button>
            )}
            {!isLast ? (
              <button className="btn-primary" onClick={() => setCurrent(c => c + 1)} style={{ padding: '0.5rem 1rem' }}>
                Next →
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={!allAnswered}
                style={{ opacity: allAnswered ? 1 : 0.5 }}>
                Submit Test ✓
              </button>
            )}
          </div>
        </div>
        {!allAnswered && isLast && (
          <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'right' }}>
            {questions.length - Object.keys(answers).length} question(s) unanswered
          </p>
        )}
      </div>
    );
  }

  // Submitting
  if (phase === 'submitting') {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #1e293b', borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
        <p style={{ color: '#94a3b8' }}>Analysing your answers...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Results Phase
  if (phase === 'done' && result) {
    const pct = parseFloat(result.percentage);
    const scoreColor = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
    const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Needs Work';
    return (
      <div className="page-container" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', border: `1px solid ${scoreColor}40`, background: `${scoreColor}05` }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {pct >= 70 ? '🏆' : pct >= 40 ? '✅' : '📖'}
          </div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc', marginBottom: '0.5rem' }}>Test Completed!</h2>
          <div style={{ fontSize: '3.5rem', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: scoreColor }}>{pct}%</div>
          <div style={{ color: scoreColor, fontWeight: 600, marginBottom: '0.5rem' }}>{grade}</div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {result.score} out of {result.total} correct
          </p>
          <div style={{
            marginTop: '1.25rem', padding: '1rem',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Recommended Career Path</p>
            <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>{result.careerSuggestion}</p>
          </div>
        </div>

        {/* Detailed Answers */}
        <h3 style={{ fontFamily: 'Syne,sans-serif', color: '#f8fafc', marginBottom: '1.25rem' }}>Detailed Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {result.detailedAnswers?.map((ans, i) => {
            const qData = questions[i];
            if (!qData) return null;
            const opts = typeof qData.options === 'string' ? JSON.parse(qData.options) : qData.options;
            return (
              <div key={i} style={{
                padding: '1rem', borderRadius: '12px',
                background: ans.isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                border: `1px solid ${ans.isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {ans.isCorrect ? <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                  <div>
                    <p style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                      Q{i + 1}: {qData.question}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: ans.isCorrect ? '#10b981' : '#ef4444' }}>
                      Your answer: {opts[ans.selectedOption] ?? 'Not answered'}
                    </p>
                    {!ans.isCorrect && (
                      <p style={{ fontSize: '0.8rem', color: '#10b981' }}>
                        Correct: {opts[ans.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setPhase('select')}>Retake Test</button>
          <button className="btn-primary" onClick={() => navigate('/results')}>View All Results</button>
          <button className="btn-secondary" onClick={() => navigate('/careers')}>Get Career Recommendations</button>
        </div>
      </div>
    );
  }

  return null;
}
