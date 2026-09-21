import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ZoqelleLogo from '../assets/ZoqelleLogo.png';

export default function Register() {
  const { user, loading, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email, password, name);
      toast.success('Welcome to Zoqelle!');
      navigate('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Google sign-up failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <div className="w-full max-w-md bg-surface-bright rounded-2xl border border-outline-variant/80 p-8 md:p-10 animate-slide-up shadow-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <img src={ZoqelleLogo} alt="Zoqelle Logo" className="h-12 w-auto object-contain mb-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary mb-1">
            Join Our Bakery
          </span>
          <h1 className="text-2xl md:text-3xl text-on-surface" style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}>
            Create Your Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface border border-outline-variant text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-accent-gold transition-colors text-sm focus-ring"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 mt-2 py-3 px-4 text-xs font-semibold uppercase tracking-wide text-on-primary transition-all disabled:opacity-60 focus-ring cursor-pointer"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-outline-variant/60" />
          <span className="px-4 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
            or
          </span>
          <div className="flex-1 h-px bg-outline-variant/60" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 border border-outline-variant hover:bg-surface-container py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-on-surface transition-all disabled:opacity-60 focus-ring cursor-pointer"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent-gold hover:underline transition-colors focus-ring">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}