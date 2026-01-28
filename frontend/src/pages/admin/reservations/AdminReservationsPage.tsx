import { useState, useEffect } from 'react';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';

const STATUS_LABELS = {
  pending: 'Oczekująca',
  confirmed: 'Potwierdzona',
  canceled: 'Anulowana',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'canceled'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationsApi.getReservations();
      if (response.data) {
        setReservations(response.data);
      }
    } catch (error) {
      console.error('Błąd ładowania rezerwacji:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await reservationsApi.confirmReservation(id);
      loadReservations();
    } catch (error) {
      alert('Błąd potwierdzania rezerwacji');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) return;
    try {
      await reservationsApi.cancelReservation(id);
      loadReservations();
    } catch (error) {
      alert('Błąd anulowania rezerwacji');
    }
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Zarządzanie rezerwacjami</h1>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>Wszystkie</button>
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>Oczekujące</button>
          <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 rounded ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>Potwierdzone</button>
          <button onClick={() => setFilter('canceled')} className={`px-4 py-2 rounded ${filter === 'canceled' ? 'bg-red-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>Anulowane</button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="bg-card border border-border rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-card-foreground">{reservation.court.name}</h3>
                <p className="text-sm text-muted-foreground">Użytkownik: {reservation.user.email}</p>
                <p className="text-sm text-muted-foreground">Od: {new Date(reservation.start_at).toLocaleString('pl-PL')}</p>
                <p className="text-sm text-muted-foreground">Do: {new Date(reservation.end_at).toLocaleString('pl-PL')}</p>
                <p className="text-sm text-muted-foreground">Gracze: {reservation.players_count}</p>
                <p className="text-sm text-muted-foreground">Kwota: {reservation.total_amount} zł</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 rounded text-sm font-medium bg-secondary text-secondary-foreground">{STATUS_LABELS[reservation.status]}</span>
                {reservation.status === 'pending' && (
                  <>
                    <button onClick={() => handleConfirm(reservation.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Potwierdź</button>
                    <button onClick={() => handleCancel(reservation.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Anuluj</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
