import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-loader-4-line text-2xl text-primary animate-spin" />
          </div>
          <p className="text-sm font-roboto text-[#7a7a7a]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
