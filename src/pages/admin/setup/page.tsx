import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EDGE_FN = 'https://iisgbnbwbmxrdvhmolee.supabase.co/functions/v1/create-admin-user';

export default function AdminSetup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'running' | 'success' | 'error'>('running');
  const [message, setMessage] = useState('Creating your admin account...');

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(EDGE_FN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-user',
            email: 'gracekamie@yahoo.com',
            password: 'WILLOW@11',
            full_name: 'Grace Kamie',
            role: 'super_admin',
          }),
        });

        const data = await res.json();

        if (res.status === 409) {
          setStatus('success');
          setMessage('Account already exists! You can sign in now.');
          setTimeout(() => navigate('/admin/login'), 2500);
          return;
        }

        if (!res.ok || data.error) {
          setStatus('error');
          setMessage(data.error ?? 'Something went wrong. Please try again.');
          return;
        }

        setStatus('success');
        setMessage('Account created! Redirecting you to login...');
        setTimeout(() => navigate('/admin/login'), 2500);
      } catch {
        setStatus('error');
        setMessage('Network error — please refresh and try again.');
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
      <div className="bg-white rounded-xl border border-[#e8e2d9] px-10 py-12 w-full max-w-sm text-center">
        <img
          src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
          alt="Oceans Uganda"
          className="h-10 w-auto object-contain mx-auto mb-8"
        />

        {status === 'running' && (
          <>
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#0d1f2d]/8 mx-auto mb-5">
              <i className="ri-loader-4-line text-[#0d1f2d] text-2xl animate-spin" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold text-base mb-1">Setting up your account</p>
            <p className="text-[#a0a0a0] text-sm font-roboto">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-100 mx-auto mb-5">
              <i className="ri-checkbox-circle-line text-emerald-600 text-2xl" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold text-base mb-1">You&apos;re all set!</p>
            <p className="text-[#a0a0a0] text-sm font-roboto">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100 mx-auto mb-5">
              <i className="ri-error-warning-line text-red-500 text-2xl" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold text-base mb-1">Setup failed</p>
            <p className="text-red-500 text-sm font-roboto mb-5">{message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white text-sm font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
