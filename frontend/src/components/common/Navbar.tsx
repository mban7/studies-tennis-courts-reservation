import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              Korty Tenisowe
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {!isAdmin && (
                <>
                  <Link to="/courts" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Korty
                  </Link>
                  <Link to="/reservations" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Moje rezerwacje
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Link to="/admin" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Panel admina
                  </Link>
                  <Link to="/admin/courts" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Zarządzaj kortami
                  </Link>
                  <Link to="/admin/reservations" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Wszystkie rezerwacje
                  </Link>
                  <Link to="/admin/users" className="hover:bg-gray-700/50 hover:text-primary px-3 py-2 rounded transition-colors">
                    Użytkownicy
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user?.email} {isAdmin && <span className="text-primary font-medium">(Admin)</span>}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
