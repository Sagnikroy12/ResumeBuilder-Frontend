import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, FilePlus, LogOut, User, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, checkUser } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTogglePremium = async () => {
    try {
      await authApi.togglePremium();
      await checkUser();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <Link to="/">
          <Sparkles className="brand-icon" />
          <span>Resume Builder</span>
        </Link>
      </div>

      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        {user ? (
          <>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            {user.is_premium ? (
              <span className="premium-badge">Pro</span>
            ) : (
              <Link to="/upgrade" className="upgrade-btn" onClick={() => setIsMobileMenuOpen(false)}>Upgrade to Pro</Link>
            )}
            {user.email === 'sagnikruproy11@gmail.com' && (
              <button 
                onClick={() => { handleTogglePremium(); setIsMobileMenuOpen(false); }} 
                className="master-toggle-btn"
                title="Toggle Master Pro Status"
              >
                <ShieldCheck size={18} />
                <span>Toggle Tier</span>
              </button>
            )}
            <div className="user-profile">
              <User size={18} />
              <span>{user.username}</span>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-btn" onClick={() => setIsMobileMenuOpen(false)}>Sign Up Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
