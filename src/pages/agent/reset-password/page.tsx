import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type Stage = 'form' | 'success' | 'invalid';

export default function AgentResetPasswordPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('form');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStage('form');
      }
    });

    const hash = window.location.hash;
    if (!hash || (!hash.includes('access_token') && !hash.includes('type=recovery'))) {
      const timer = setTimeout(() => setStage('invalid'), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const getStrength = (pw: string): { label: string; color: string; width: string } => {
    if (pw.length === 0) return { label: '', color: '', width: 'w-0' };
    if (pw.length < 6) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (pw.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score === 3) return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
    if (score === 2) return { label: 'Good', color: 'bg-[#D5A91C]', width: 'w-3/4' };
    return { label: 'Fair', color: 'bg-yellow-400', width: 'w-2/4' };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (err) {
      setError(err.message);
    } else {
      setStage('success');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f5f0]">
      {/* Left panel */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20Kampala%20Uganda%20cityscape%20aerial%20view%20golden%20hour%20luxury%20apartments%20real%20estate%20agent%20professional%20warm%20tones%20cinematic&width=720&height=1080&seq=agentloginbg01&orientation=portrait)',
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
            Agent Portal
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Set a new password to regain access to your agent dashboard.
          </p>
          <div className="mt-10 space-y-3">
            {[
              { icon: 'ri-lock-password-line', text: 'At least 8 characters' },
              { icon: 'ri-text-wrap', text: 'Mix of letters and numbers' },
              { icon: 'ri-shield-check-line', text: 'At least one special character' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/80 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10">
                  <i className={`${item.icon} text-sm text-[#D5A91C]`} />
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <img
              src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
              alt="Oceans Uganda"
              className="h-10 w-auto object-contain rounded-lg mx-auto"
            />
          </div>

          {/* ── FORM ── */}
          {stage === 'form' && (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D5A91C]/10 border border-[#D5A91C]/20 mb-6">
                <i className="ri-shield-keyhole-line text-[#D5A91C] text-xs" />
                <span className="text-[#D5A91C] text-xs font-roboto font-semibold tracking-wide">Agent Portal</span>
              </div>

              <h2 className="text-2xl font-bold mb-2" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Set a new password
              </h2>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Choose a strong password to secure your agent account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                    New Password
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
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D5A91C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className={showPassword ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} />
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-[10px] font-roboto mt-1 ${strength.color.replace('bg-', 'text-')}`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <i className="ri-lock-2-line text-gray-400" />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Re-enter your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D5A91C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className={showConfirm ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} />
                    </button>
                  </div>
                  {confirm.length > 0 && password !== confirm && (
                    <p className="text-xs text-red-400 mt-1 font-roboto">Passwords don&apos;t match</p>
                  )}
                  {confirm.length > 0 && password === confirm && password.length >= 8 && (
                    <p className="text-xs text-emerald-500 mt-1 font-roboto">Passwords match</p>
                  )}
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
                  style={{ backgroundColor: '#D5A91C' }}
                >
                  {submitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── SUCCESS ── */}
          {stage === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-6">
                <i className="ri-shield-check-line text-emerald-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Password updated!
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Your password has been changed successfully. Sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/agent/login')}
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                style={{ backgroundColor: '#D5A91C' }}
              >
                <i className="ri-login-box-line" />
                Go to Agent Login
              </button>
            </div>
          )}

          {/* ── INVALID ── */}
          {stage === 'invalid' && (
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 border border-red-100 mx-auto mb-6">
                <i className="ri-error-warning-line text-red-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Link expired
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                This reset link is invalid or has expired. Links are only valid for 1 hour. Please request a new one.
              </p>
              <button
                type="button"
                onClick={() => navigate('/agent/login')}
                className="w-full py-3 border border-gray-300 hover:border-gray-500 text-gray-700 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-arrow-left-line" />
                Back to Agent Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
