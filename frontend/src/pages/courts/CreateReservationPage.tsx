import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courtsApi, reservationsApi } from '@/lib/api';
import type { Court, Reservation } from '@/types';

export default function CreateReservationPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const [court, setCourt] = useState<Court | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [playersCount, setPlayersCount] = useState(2);
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    loadData();
  }, [courtId]);

  const loadData = async () => {
    if (!courtId) {
      setError('Brak ID kortu');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const courtResponse = await courtsApi.getCourt(courtId);
      
      if (courtResponse.data) {
        setCourt(courtResponse.data);
      } else {
        setError('Nie znaleziono kortu');
        setLoading(false);
        return;
      }
      
      const reservationsResponse = await reservationsApi.getCourtReservations(courtId);
      
      if (reservationsResponse.data) {
        setReservations(reservationsResponse.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nie udało się załadować danych');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const isRangeOccupied = (date: string, startTime: string, endTime: string) => {
    if (!date || !startTime || !endTime) return false;
    
    const [year, month, day] = date.split('-').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const selectedStart = new Date(year, month - 1, day, startHours, startMinutes);
    const selectedEnd = new Date(year, month - 1, day, endHours, endMinutes);
    
    // Check if the selected range overlaps with any existing reservation
    return reservations.some(reservation => {
      const resStart = new Date(reservation.start_at);
      const resEnd = new Date(reservation.end_at);
      
      // Two ranges overlap if: start1 < end2 AND start2 < end1
      return selectedStart < resEnd && resStart < selectedEnd;
    });
  };

  const isTimeSlotOccupied = (date: string, time: string, isEndTime: boolean = false) => {
    if (!date || !time) return false;
    
    // Parse selected date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const checkDateTime = new Date(year, month - 1, day, hours, minutes);
    
    return reservations.some(reservation => {
      const resStart = new Date(reservation.start_at);
      const resEnd = new Date(reservation.end_at);
      
      if (isEndTime) {
        // For end time: check if it's within or at the boundaries of existing reservation
        return checkDateTime > resStart && checkDateTime <= resEnd;
      } else {
        // For start time: check if it's within existing reservation (excluding exact end time)
        return checkDateTime >= resStart && checkDateTime < resEnd;
      }
    });
  };

  const getOccupiedSlots = () => {
    if (!selectedDate) return [];
    
    return reservations
      .filter(res => {
        const resStart = new Date(res.start_at);
        // Get local date without timezone conversion
        const year = resStart.getFullYear();
        const month = String(resStart.getMonth() + 1).padStart(2, '0');
        const day = String(resStart.getDate()).padStart(2, '0');
        const resDate = `${year}-${month}-${day}`;
        return resDate === selectedDate;
      })
      .map(res => {
        const start = new Date(res.start_at);
        const end = new Date(res.end_at);
        return {
          start: `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`,
          end: `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`,
          reservation: res,
        };
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!courtId || !selectedDate || !selectedStartTime || !selectedEndTime) return;

    // Check if the selected range is occupied
    if (isRangeOccupied(selectedDate, selectedStartTime, selectedEndTime)) {
      setError('Wybrany przedział czasowy jest już zajęty. Wybierz inny termin.');
      return;
    }

    setSubmitting(true);
    setError('');

    const start_at = `${selectedDate}T${selectedStartTime}`;
    const end_at = `${selectedDate}T${selectedEndTime}`;

    try {
      await reservationsApi.createReservation({
        court_id: courtId,
        players_count: playersCount,
        start_at,
        end_at,
        additional_info: additionalInfo,
      });
      navigate('/reservations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd tworzenia rezerwacji');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;
  if (!court) return <div className="text-center py-12 text-muted-foreground">Kort nie znaleziony</div>;

  const timeSlots = generateTimeSlots();
  const occupiedSlots = getOccupiedSlots();
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Rezerwacja kortu: {court.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-card shadow rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Data rezerwacji</label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedStartTime('');
                  setSelectedEndTime('');
                }}
                className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                required
              />
            </div>

            {selectedDate && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Godzina rozpoczęcia</label>
                  <select
                    value={selectedStartTime}
                    onChange={(e) => {
                      setSelectedStartTime(e.target.value);
                      setSelectedEndTime('');
                    }}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                    required
                  >
                    <option value="">Wybierz godzinę</option>
                    {timeSlots.map(time => {
                      const occupied = isTimeSlotOccupied(selectedDate, time);
                      return (
                        <option key={time} value={time} disabled={occupied}>
                          {time} {occupied ? '(zajęte)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedStartTime && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Godzina zakończenia</label>
                    <select
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                      required
                    >
                      <option value="">Wybierz godzinę</option>
                      {timeSlots
                        .filter(time => time > selectedStartTime)
                        .map(time => {
                          // Check if selecting this end time would create a conflict
                          const wouldConflict = isRangeOccupied(selectedDate, selectedStartTime, time);
                          return (
                            <option key={time} value={time} disabled={wouldConflict}>
                              {time} {wouldConflict ? '(konflikt)' : ''}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Liczba graczy (max: {court.max_players})
              </label>
              <input
                type="number"
                min="1"
                max={court.max_players}
                value={playersCount}
                onChange={(e) => setPlayersCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Dodatkowe informacje (opcjonalnie)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                rows={3}
                placeholder="Np. dodatkowe wymagania, uwagi..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || !selectedDate || !selectedStartTime || !selectedEndTime}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Tworzenie...' : 'Zarezerwuj'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/courts')}
                className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-secondary/80"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-3 text-card-foreground">Informacje o korcie</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Typ:</strong> {court.court_type === 'indoor' ? 'Kryty' : 'Odkryty'}</p>
              <p><strong>Nawierzchnia:</strong> {court.surface === 'hard' ? 'Twarda' : court.surface === 'clay' ? 'Mączka ceglana' : 'Trawa'}</p>
              <p><strong>Max graczy:</strong> {court.max_players}</p>
              {court.prices.length > 0 && (
                <p className="text-lg font-bold text-primary mt-3">
                  {court.prices[0].price_per_hour} zł/godz
                </p>
              )}
            </div>
          </div>

          {selectedDate && occupiedSlots.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-sm mb-2 text-yellow-900 dark:text-yellow-400">
                Zajęte terminy ({selectedDate})
              </h3>
              <div className="space-y-1 text-xs text-yellow-800 dark:text-yellow-300">
                {occupiedSlots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>{slot.start} - {slot.end}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDate && occupiedSlots.length === 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-sm mb-1 text-green-900 dark:text-green-400">
                Wszystkie terminy dostępne!
              </h3>
              <p className="text-xs text-green-800 dark:text-green-300">
                Kort jest wolny przez cały dzień {selectedDate}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
