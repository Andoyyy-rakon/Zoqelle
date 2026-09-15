import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { signIn, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back to Zoqelle Admin!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error((err as Error).message);
      setGoogleLoading(false);
    }
  };

  const googleSvg = (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: 'var(--font-family-body)' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-surface-bright rounded-3xl border border-outline-variant/80 p-8 sm:p-10" style={{ boxShadow: 'var(--shadow-card)' }}>
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-block group">
              <span className="text-3xl font-bold tracking-tight text-on-surface block" style={{ fontFamily: 'var(--font-family-display)' }}>
                Zoqelle
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-accent-gold font-semibold block mt-1">
                Editorial Admin
              </span>
            </Link>
            <p className="mt-3 text-xs text-on-surface-variant">
              Sign in to manage patisserie orders & inventory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || submitting}
                  className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant/80 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
                  placeholder="admin@zoqelle.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || submitting}
                  className="w-full pl-11 pr-11 py-3 bg-surface border border-outline-variant/80 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-accent-gold transition-colors focus-ring text-sm"
                  placeholder="Enter your secret key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || submitting}
              className="w-full py-3.5 text-sm font-semibold text-on-primary rounded-xl transition-all shadow-sm focus-ring disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-surface-bright text-on-surface-variant">
                Or authenticate with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface border border-outline-variant/80 rounded-xl text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : googleSvg}
            {googleLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-on-surface-variant">
          Zoqelle Patisserie Management Portal · Need access?{' '}
          <a href="mailto:support@zoqelle.com" className="text-accent-gold hover:underline font-semibold">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}