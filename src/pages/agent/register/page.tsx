import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Step = 1 | 2 | 3;

interface FormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  whatsapp: string;
  title: string;
  bio: string;
}

const EMPTY: FormData = {
  full_name: '',
  email: '',
  password: '',
  confirm_password: '',
  phone: '',
  whatsapp: '',
  title: '',
  bio: '',
};

export default function AgentRegister() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm_password) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!form.phone.trim()) return 'Phone number is required.';
    return null;
  };

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setStep((prev) => (prev < 3 ? (prev + 1) as Step : prev));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signUp({
      email: form.email,
      password: form.password,
      full_name: form.full_name,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      bio: form.bio,
      title: form.title || 'Sales Agent',
      role: 'agent',
    });
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setStep(3);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9599]';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            'url(https://readdy.ai/api/search-image?query=professional%20real%20estate%20agent%20Kampala%20Uganda%20modern%20office%20luxury%20property%20interior%20warm%20natural%20light%20elegant%20workspace%20premium%20lifestyle&width=720&height=1080&seq=agentregbg01&orientation=portrait)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#002349]/90 to-[#002349]/70" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/">
            <img
              src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
              alt="Oceans Uganda"
              className="rounded-lg mb-6 h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <h1 className="text-3xl font-jost font-bold mb-2">
            Join as an Agent
          </h1>
          <p className="text-gray-200" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Grow your real estate career with Oceans — Uganda&apos;s premier property platform.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: 'ri-home-smile-line', text: 'List & manage your properties' },
              { icon: 'ri-user-received-2-line', text: 'Receive and track buyer leads' },
              { icon: 'ri-line-chart-line', text: 'Monitor your performance' },
              { icon: 'ri-shield-check-line', text: 'Verified agent badge' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/15 shrink-0">
                  <i className={`${item.icon} text-[#0D9599] text-sm`} />
                </div>
                <p className="text-gray-200 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {item.text}
                </p>
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
              className="rounded-lg mx-auto h-10 w-auto object-contain"
            />
          </div>

          {/* ── STEP 1 & 2 HEADER ── */}
          {step !== 3 && (
            <>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                {step === 1 ? 'Create your account' : 'Your profile'}
              </h2>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {step === 1
                  ? 'Join the Oceans Uganda agent network. Your account will be reviewed before activation.'
                  : 'Tell us a bit more about yourself so clients can find you.'}
              </p>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: step >= s ? '#0D9599' : '#e5e7eb',
                        color: step >= s ? '#fff' : '#9ca3af',
                      }}
                    >
                      {step > s ? <i className="ri-check-line text-xs" /> : s}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: step === s ? '#002349' : '#9ca3af' }}
                    >
                      {s === 1 ? 'Account' : 'Profile'}
                    </span>
                    {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-user-line text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                    required
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
              </div>

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
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                    placeholder="agent@email.com"
                    className={inputClass}
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
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Toggle password"
                  >
                    <i className={showPw ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} />
                  </button>
                </div>
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
                    type={showConfirmPw ? 'text' : 'password'}
                    value={form.confirm_password}
                    onChange={(e) => set('confirm_password', e.target.value)}
                    required
                    placeholder="Repeat password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Toggle confirm password"
                  >
                    <i className={showConfirmPw ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <i className="ri-error-warning-line text-red-500 text-sm mt-0.5 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                style={{ backgroundColor: '#0D9599' }}
              >
                Continue
                <i className="ri-arrow-right-line" />
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                  Agent Title
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-briefcase-line text-gray-400" />
                  </span>
                  <select
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select title</option>
                    <option>Sales Agent</option>
                    <option>Senior Sales Agent</option>
                    <option>Rental Specialist</option>
                    <option>Luxury Property Consultant</option>
                    <option>Commercial Property Agent</option>
                    <option>Property Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-phone-line text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    required
                    placeholder="+256 700 000 000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                  WhatsApp Number{' '}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                    <i className="ri-whatsapp-line text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                    placeholder="+256 700 000 000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#002349' }}>
                  Short Bio{' '}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  rows={3}
                  placeholder="Tell clients a little about yourself and your experience..."
                  maxLength={300}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9599] resize-none"
                />
                <p className="text-right text-xs text-gray-400 mt-1">{form.bio.length}/300</p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <i className="ri-error-warning-line text-red-500 text-sm mt-0.5 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0D9599' }}
                >
                  {loading ? (
                    <><i className="ri-loader-4-line animate-spin" /> Submitting...</>
                  ) : (
                    <><i className="ri-send-plane-line" /> Submit Application</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3 — SUCCESS ── */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-6">
                <i className="ri-checkbox-circle-line text-emerald-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#002349', fontFamily: 'Prata, sans-serif' }}>
                Application Submitted!
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                Your agent account has been created and is pending approval. Our team will review your application and activate your account within 1–2 business days.
              </p>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold mb-2" style={{ color: '#002349' }}>What happens next?</p>
                <ul className="space-y-2">
                  {[
                    'Our team reviews your application',
                    "You'll receive an email when approved",
                    'Log in to access your agent dashboard',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-500 text-xs">
                      <i className="ri-check-line text-xs mt-0.5 shrink-0" style={{ color: '#0D9599' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/admin/login"
                className="block w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap text-center"
                style={{ backgroundColor: '#0D9599' }}
              >
                Go to Sign In
              </Link>
            </div>
          )}

          {step !== 3 && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/admin/login"
                className="font-semibold hover:underline cursor-pointer"
                style={{ color: '#0D9599' }}
              >
                Sign in here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
