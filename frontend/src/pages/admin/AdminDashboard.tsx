import { useState, useEffect } from 'react';
import { reservationsApi, courtsApi, usersApi } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalCourts: 0,
    activeCourts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [reservationsRes, courtsRes, usersRes] = await Promise.all([
        reservationsApi.getReservations(),
        courtsApi.getCourts(),
        usersApi.getUsers(),
      ]);

      const reservations = reservationsRes.data || [];
      const courts = courtsRes.data || [];
      const users = usersRes.data || [];

      setStats({
        totalReservations: reservations.length,
        pendingReservations: reservations.filter(r => r.status === 'pending').length,
        confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
        totalCourts: courts.length,
        activeCourts: courts.filter(c => c.is_active).length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error('Błąd ładowania statystyk:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">Panel Administratora</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Wszystkie rezerwacje</h3>
          <p className="text-3xl font-bold text-card-foreground">{stats.totalReservations}</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Oczekujące rezerwacje</h3>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pendingReservations}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Potwierdzone rezerwacje</h3>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.confirmedReservations}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Wszystkie korty</h3>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.totalCourts}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Aktywne korty</h3>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.activeCourts}</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg shadow p-6">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Użytkownicy</h3>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
