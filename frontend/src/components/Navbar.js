import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Compass, BookOpen, FileText, Brain,
  LogOut, Menu, X, ChevronDown, Shield
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stream', label: 'Explore', icon: Compass },
  { to: '/careers', label: 'Careers', icon: Brain },
  { to: '/exams', label: 'Exams', icon: BookOpen },
  { to: '/test', label: 'Aptitude Test', icon: FileText },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(2, 8, 23, 0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1e293b', height: '70px',
      display: 'flex', alignItems: 'center', padding: '0 1.5rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.1rem', color: '#000', fontFamily: 'Syne, sans-serif'
          }}>CG</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
            Career<span style={{ color: '#f59e0b' }}>Guide</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 0.85rem', borderRadius: '8px', textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s',
                color: active ? '#f59e0b' : '#94a3b8',
                background: active ? 'rgba(245,158,11,0.1)' : 'transparent',
                border: active ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent'
              }}>
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}
          {user?.id === 1 && (
            <Link to="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 0.85rem', borderRadius: '8px', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 500, color: '#8b5cf6',
              background: location.pathname === '/admin' ? 'rgba(139,92,246,0.1)' : 'transparent',
              border: '1px solid transparent'
            }}>
              <Shield size={15} />Admin
            </Link>
          )}
        </div>

        {/* User & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>{user?.name}</span>
            {user?.stream && (
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 500 }}>{user.stream}</span>
            )}
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', padding: '0.5rem 0.85rem', borderRadius: '8px',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
