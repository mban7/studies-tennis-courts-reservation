import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import RoleBasedRedirect from '@/components/common/RoleBasedRedirect';
import MainLayout from '@/layout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// User pages
import CourtsListPage from '@/pages/courts/CourtsListPage';
import CreateReservationPage from '@/pages/courts/CreateReservationPage';
import MyReservationsPage from '@/pages/reservations/MyReservationsPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCourtsPage from '@/pages/admin/courts/AdminCourtsPage';
import AdminReservationsPage from '@/pages/admin/reservations/AdminReservationsPage';
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RoleBasedRedirect />,
      },
      {
        path: 'courts',
        element: (
          <ProtectedRoute userOnly>
            <CourtsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courts/:courtId/reserve',
        element: (
          <ProtectedRoute userOnly>
            <CreateReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reservations',
        element: (
          <ProtectedRoute userOnly>
            <MyReservationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/courts',
        element: (
          <ProtectedRoute adminOnly>
            <AdminCourtsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/reservations',
        element: (
          <ProtectedRoute adminOnly>
            <AdminReservationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

