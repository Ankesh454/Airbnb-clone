import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form);
      if (res && res.success) {
        login(res.token, res.user);
        navigate('/');
      } else {
        setError(res?.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Connection error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #eff6ff 50%, #f0fdf4 100%)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        padding: '2.5rem 2rem',
        animation: 'fadeIn 0.4s ease-out'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary-gradient)', borderRadius: '12px', padding: '7px', display: 'flex', color: '#fff' }}>
              <Compass size={24} />
            </div>
            wanderlust
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.75rem' }}>Welcome back</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Log in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Your username"
                required
                style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', fontSize: '0.92rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '0.85rem 2.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', fontSize: '0.92rem', fontFamily: 'inherit' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '2px' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '0.9rem', background: 'var(--primary-gradient)', color: '#fff',
              fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(227, 28, 95, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: loading ? 0.7 : 1
            }}>
            {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
