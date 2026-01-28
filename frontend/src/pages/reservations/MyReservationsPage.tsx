import { useState, useEffect } from 'react';
import { reservationsApi } from '@/lib/api';
import type { Reservation } from '@/types';

const STATUS_LABELS = {
  pending: 'Oczekująca',
  confirmed: 'Potwierdzona',
  canceled: 'Anulowana',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
  confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  canceled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id: string) => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) return;

    try {
      await reservationsApi.cancelReservation(id);
      loadReservations();
    } catch (error) {
      alert('Błąd anulowania rezerwacji');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-foreground">Moje rezerwacje</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nie masz jeszcze żadnych rezerwacji
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-card border border-border rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">{reservation.court.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Data rozpoczęcia:</strong> {new Date(reservation.start_at).toLocaleString('pl-PL')}</p>
                    <p><strong>Data zakończenia:</strong> {new Date(reservation.end_at).toLocaleString('pl-PL')}</p>
                    <p><strong>Liczba graczy:</strong> {reservation.players_count}</p>
                    <p><strong>Kwota:</strong> {reservation.total_amount} zł</p>
                    {reservation.additional_info && (
                      <p><strong>Dodatkowe info:</strong> {reservation.additional_info}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${STATUS_COLORS[reservation.status]}`}>
                    {STATUS_LABELS[reservation.status]}
                  </span>
                  {reservation.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Anuluj
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
