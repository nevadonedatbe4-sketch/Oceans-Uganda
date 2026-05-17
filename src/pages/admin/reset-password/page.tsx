import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type Stage = 'form' | 'success' | 'invalid';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('form');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Supabase puts the recovery token in the URL hash — it auto-handles the session
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStage('form');
      }
    });

    // If no hash token present at all, show invalid state after a short delay
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
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://readdy.ai/api/search-image?query=luxury%20residential%20estate%20Kampala%20Uganda%20panoramic%20aerial%20view%20at%20golden%20hour%20modern%20villas%20green%20gardens%20warm%20amber%20tones%20refined%20architecture%20cinematic%20photography&width=480&height=960&seq=adminloginbg01&orientation=portrait)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f2d]/85 via-[#0d1f2d]/70 to-[#0d1f2d]/90" />

        <div className="relative z-10 px-12 pt-14">
          <img
            src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
            alt="Oceans Uganda"
            className="h-12 w-auto object-contain brightness-0 invert"
          />
        </div>

        <div className="relative z-10 px-12 py-10">
          <div className="w-10 h-[2px] bg-[#D5A91C] mb-8" />
          <p className="text-[#D5A91C] text-xs font-medium tracking-[0.2em] uppercase mb-4 font-roboto">
            Account Security
          </p>
          <h2 className="text-white font-prata text-[2.2rem] leading-tight mb-5">
            Set a strong<br />new password
          </h2>
          <p className="text-white/55 font-roboto text-[0.9rem] leading-relaxed max-w-[280px]">
            Choose a password that&apos;s at least 8 characters and includes a mix of letters, numbers, and symbols.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { icon: 'ri-checkbox-circle-line', text: 'At least 8 characters' },
              { icon: 'ri-checkbox-circle-line', text: 'Mix of uppercase & lowercase' },
              { icon: 'ri-checkbox-circle-line', text: 'At least one number' },
              { icon: 'ri-checkbox-circle-line', text: 'At least one special character' },
            ].map((tip) => (
              <div key={tip.text} className="flex items-center gap-3">
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className={`${tip.icon} text-[#D5A91C] text-sm`} />
                </span>
                <p className="text-white/60 text-xs font-roboto">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-12 pb-12">
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <span className="text-white/30 text-xs font-roboto">Oceans Uganda © 2026</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/40 text-xs font-roboto">System online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 min-h-screen">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <img
              src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
              alt="Oceans Uganda"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* ── FORM ── */}
          {stage === 'form' && (
            <>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D5A91C]/10 mb-6">
                <i className="ri-shield-keyhole-line text-[#D5A91C] text-lg" />
              </div>

              <p className="text-[#D5A91C] text-xs font-roboto font-medium tracking-[0.2em] uppercase mb-2">
                New Password
              </p>
              <h1 className="text-[#0d1f2d] font-jost font-bold text-3xl mb-2">Set Password</h1>
              <p className="text-[#7a7a7a] font-roboto text-sm mb-8 leading-relaxed">
                Choose a strong new password for your Oceans admin account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-roboto font-semibold text-[#0d1f2d]/60 mb-1.5 uppercase tracking-widest">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                      <i className="ri-lock-line text-sm text-[#a0a0a0]" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full pl-9 pr-10 py-3 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] focus:ring-1 focus:ring-[#D5A91C]/30 transition-colors placeholder:text-[#bbb]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#a0a0a0] hover:text-[#0d1f2d] cursor-pointer transition-colors"
                    >
                      <i className={showPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1 w-full bg-[#e8e2d9] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-[10px] font-roboto mt-1 ${strength.color.replace('bg-', 'text-')}`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-roboto font-semibold text-[#0d1f2d]/60 mb-1.5 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                      <i className="ri-lock-2-line text-sm text-[#a0a0a0]" />
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Re-enter your password"
                      className="w-full pl-9 pr-10 py-3 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] focus:ring-1 focus:ring-[#D5A91C]/30 transition-colors placeholder:text-[#bbb]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#a0a0a0] hover:text-[#0d1f2d] cursor-pointer transition-colors"
                    >
                      <i className={showConfirm ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
                    </button>
                  </div>
                  {confirm.length > 0 && password !== confirm && (
                    <p className="text-[10px] font-roboto text-red-400 mt-1">Passwords don&apos;t match</p>
                  )}
                  {confirm.length > 0 && password === confirm && password.length >= 8 && (
                    <p className="text-[10px] font-roboto text-emerald-500 mt-1">Passwords match</p>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-error-warning-line text-red-500 text-sm" />
                    </span>
                    <p className="text-red-600 text-sm font-roboto leading-snug">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white font-roboto text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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

              <p className="text-[#D5A91C] text-xs font-roboto font-medium tracking-[0.2em] uppercase mb-2">
                All Done
              </p>
              <h1 className="text-[#0d1f2d] font-jost font-bold text-3xl mb-3">Password Updated</h1>
              <p className="text-[#7a7a7a] font-roboto text-sm leading-relaxed mb-8">
                Your password has been changed successfully. You can now sign in with your new credentials.
              </p>

              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full py-3.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white font-roboto text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-login-box-line" />
                Go to Sign In
              </button>
            </div>
          )}

          {/* ── INVALID LINK ── */}
          {stage === 'invalid' && (
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 border border-red-100 mx-auto mb-6">
                <i className="ri-error-warning-line text-red-400 text-2xl" />
              </div>

              <p className="text-red-400 text-xs font-roboto font-medium tracking-[0.2em] uppercase mb-2">
                Link Invalid
              </p>
              <h1 className="text-[#0d1f2d] font-jost font-bold text-3xl mb-3">Link Expired</h1>
              <p className="text-[#7a7a7a] font-roboto text-sm leading-relaxed mb-8">
                This password reset link is invalid or has expired. Reset links are only valid for 1 hour. Please request a new one.
              </p>

              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full py-3.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white font-roboto text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-arrow-left-line" />
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
