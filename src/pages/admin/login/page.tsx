import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type View = 'login' | 'forgot' | 'forgot-sent';

export default function AdminLogin() {
  const { signIn, session, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      if (profile?.role === 'agent') {
        navigate('/agent/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [session, profile, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) setError(err);
  };

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSubmitting(true);
    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo });
    setResetSubmitting(false);
    if (err) {
      setResetError(err.message);
    } else {
      setView('forgot-sent');
    }
  };

  const switchToForgot = () => {
    setResetEmail(email); // pre-fill with whatever they typed
    setResetError(null);
    setView('forgot');
  };

  const switchToLogin = () => {
    setError(null);
    setView('login');
  };

  return (
    <div className="min-h-screen flex bg-[#f7f5f0]">
      {/* Left panel */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=luxury%20residential%20estate%20Kampala%20Uganda%20panoramic%20aerial%20view%20at%20golden%20hour%20modern%20villas%20green%20gardens%20warm%20amber%20tones%20refined%20architecture%20cinematic%20photography&width=720&height=1080&seq=adminloginbg01&orientation=portrait)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#002349]/90 to-[#002349]/70" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <img
            src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
            alt="Oceans Uganda"
            className="rounded-lg mb-6 h-12 w-auto object-contain brightness-0 invert"
          />
          <h1 className="text-3xl font-jost font-bold mb-2">
            Oceans Admin
          </h1>
          <p className="text-gray-200" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Estate &amp; Letting Agents — Manage properties, users, and inquiries in one place.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <img
              src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
              alt="Oceans Uganda"
              className="h-10 w-auto object-contain rounded-lg mx-auto"
            />
          </div>

          {/* ── LOGIN VIEW ── */}
          {view === 'login' && (
            <>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Sign in
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Enter your credentials to access the admin panel.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-mail-line text-gray-400" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@oceans.co.ug"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9599]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-lock-line text-gray-400" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9599]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Show password"
                    >
                      <i className={showPassword ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#0D9599]" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="font-semibold hover:underline cursor-pointer whitespace-nowrap"
                    style={{ color: '#0D9599' }}
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-error-warning-line text-red-500 text-sm" />
                    </span>
                    <p className="text-red-600 text-sm leading-snug">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0D9599' }}
                >
                  {submitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Back to{' '}
                <Link to="/" className="font-semibold hover:underline" style={{ color: '#0D9599' }}>
                  website
                </Link>
              </p>
            </>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === 'forgot' && (
            <>
              <button
                type="button"
                onClick={switchToLogin}
                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm mb-8 cursor-pointer group"
              >
                <i className="ri-arrow-left-line group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </button>

              <div className="w-10 h-10 flex items-center justify-center rounded-full mb-6" style={{ backgroundColor: '#0D9599' + '1a' }}>
                <i className="ri-lock-password-line text-lg" style={{ color: '#0D9599' }} />
              </div>

              <h2 className="text-2xl font-bold mb-2" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Reset Password
              </h2>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Enter your email address and we&apos;ll send you a secure link to reset your password.
              </p>

              <form onSubmit={handleForgot} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-mail-line text-gray-400" />
                    </span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="admin@oceans.co.ug"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9599]"
                    />
                  </div>
                </div>

                {resetError && (
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-error-warning-line text-red-500 text-sm" />
                    </span>
                    <p className="text-red-600 text-sm leading-snug">{resetError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0D9599' }}
                >
                  {resetSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                Check your spam folder if the email doesn&apos;t arrive within a few minutes.
              </p>
            </>
          )}

          {/* ── FORGOT SENT CONFIRMATION ── */}
          {view === 'forgot-sent' && (
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-6">
                <i className="ri-mail-check-line text-emerald-500 text-2xl" />
              </div>

              <h2 className="text-2xl font-bold mb-3" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Check your inbox
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                We&apos;ve sent a password reset link to:
              </p>
              <p className="text-sm font-semibold mb-6 break-all" style={{ color: '#002349' }}>
                {resetEmail}
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-8">
                <p className="text-gray-500 text-xs leading-relaxed">
                  Click the link in the email to set a new password. The link expires in{' '}
                  <strong className="text-gray-700">1 hour</strong>. If you don&apos;t see it, check your spam or junk folder.
                </p>
              </div>

              <button
                type="button"
                onClick={switchToLogin}
                className="w-full py-3 border border-gray-300 hover:border-gray-500 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-arrow-left-line" />
                Back to Sign In
              </button>

              <button
                type="button"
                onClick={() => { setView('forgot'); }}
                className="mt-3 text-xs text-gray-400 hover:text-[#0D9599] transition-colors cursor-pointer"
              >
                Didn&apos;t receive it? Send again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
