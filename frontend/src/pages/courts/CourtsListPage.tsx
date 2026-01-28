import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courtsApi } from '@/lib/api';
import type { Court } from '@/types';

const COURT_TYPE_LABELS = {
  indoor: 'Kryty',
  outdoor: 'Odkryty',
};

const SURFACE_LABELS = {
  clay: 'Mączka ceglana',
  grass: 'Trawa',
  hard: 'Twarda',
};

export default function CourtsListPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const response = await courtsApi.getCourts();
      if (response.data) {
        setCourts(response.data.filter(c => c.is_active));
      }
    } catch (error) {
      console.error('Błąd ładowania kortów:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourts = filter === 'all' 
    ? courts 
    : courts.filter(c => c.court_type === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dostępne korty tenisowe</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setFilter('indoor')}
            className={`px-4 py-2 rounded ${filter === 'indoor' ? 'bg-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
          >
            Kryte
          </button>
          <button
            onClick={() => setFilter('outdoor')}
            className={`px-4 py-2 rounded ${filter === 'outdoor' ? 'bg-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
          >
            Odkryte
          </button>
        </div>
      </div>

      {filteredCourts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Brak dostępnych kortów
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <div key={court.id} className="bg-card border border-border rounded-lg shadow hover:shadow-lg transition p-6">
              <h3 className="text-xl font-bold mb-2 text-card-foreground">{court.name}</h3>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p><strong>Typ:</strong> {COURT_TYPE_LABELS[court.court_type]}</p>
                <p><strong>Nawierzchnia:</strong> {SURFACE_LABELS[court.surface]}</p>
                <p><strong>Max graczy:</strong> {court.max_players}</p>
                <p><strong>Lokalizacja:</strong> {court.city}, {court.street}</p>
                {court.prices.length > 0 && (
                  <p className="text-lg font-bold text-blue-600">
                    {court.prices[0].price_per_hour} zł/godz
                  </p>
                )}
              </div>
              {court.description && (
                <p className="text-sm text-muted-foreground mb-4">{court.description}</p>
              )}
              <Link
                to={`/courts/${court.id}/reserve`}
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Zarezerwuj
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
