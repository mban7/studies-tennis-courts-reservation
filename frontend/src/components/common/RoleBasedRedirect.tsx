import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function RoleBasedRedirect() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return <Navigate to={isAdmin ? '/admin' : '/courts'} replace />;
}
