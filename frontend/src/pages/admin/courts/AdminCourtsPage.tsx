import { useState, useEffect } from 'react';
import { courtsApi } from '@/lib/api';
import type { Court } from '@/types';

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    court_type: 'outdoor' as 'indoor' | 'outdoor',
    surface: 'hard' as 'clay' | 'grass' | 'hard',
    max_players: 2,
    city: '',
    street: '',
    postal_code: '',
    description: '',
    price_per_hour: '0.00',
  });

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      const response = await courtsApi.getCourts();
      if (response.data) {
        setCourts(response.data);
      }
    } catch (error) {
      console.error('Błąd ładowania kortów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCourt) {
        await courtsApi.updateCourt(editingCourt.id, {
          ...formData,
          prices: { price_per_hour: formData.price_per_hour },
        });
      } else {
        await courtsApi.createCourt({
          ...formData,
          prices: { price_per_hour: formData.price_per_hour },
        });
      }
      resetForm();
      loadCourts();
    } catch (error) {
      alert('Błąd zapisu kortu');
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      court_type: court.court_type,
      surface: court.surface,
      max_players: court.max_players,
      city: court.city,
      street: court.street,
      postal_code: court.postal_code,
      description: court.description || '',
      price_per_hour: court.prices[0]?.price_per_hour || '0.00',
    });
    setShowForm(true);
  };

  const handleToggle = async (id: string) => {
    try {
      await courtsApi.toggleCourt(id);
      loadCourts();
    } catch (error) {
      alert('Błąd zmiany statusu kortu');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      court_type: 'outdoor',
      surface: 'hard',
      max_players: 2,
      city: '',
      street: '',
      postal_code: '',
      description: '',
      price_per_hour: '0.00',
    });
    setEditingCourt(null);
    setShowForm(false);
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Zarządzanie kortami</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? 'Anuluj' : 'Dodaj kort'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4 border border-border">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Nazwa</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Typ kortu</label>
            <select value={formData.court_type} onChange={(e) => setFormData({...formData, court_type: e.target.value as any})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded">
              <option value="outdoor">Odkryty</option>
              <option value="indoor">Kryty</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Nawierzchnia</label>
            <select value={formData.surface} onChange={(e) => setFormData({...formData, surface: e.target.value as any})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded">
              <option value="hard">Twarda</option>
              <option value="clay">Mączka ceglana</option>
              <option value="grass">Trawa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Max graczy</label>
            <input type="number" min="1" max="4" value={formData.max_players} onChange={(e) => setFormData({...formData, max_players: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Miasto</label>
            <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Ulica</label>
            <input type="text" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Kod pocztowy</label>
            <input type="text" value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Cena za godzinę (zł)</label>
            <input type="number" step="0.01" value={formData.price_per_hour} onChange={(e) => setFormData({...formData, price_per_hour: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-foreground">Opis</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-background border border-border text-foreground rounded" rows={3} />
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {editingCourt ? 'Aktualizuj' : 'Dodaj kort'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map((court) => (
          <div key={court.id} className="bg-card border border-border rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2 text-card-foreground">{court.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{court.city}, {court.street}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(court)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edytuj</button>
              <button onClick={() => handleToggle(court.id)} className={`px-4 py-2 rounded ${court.is_active ? 'bg-red-600' : 'bg-green-600'} text-white hover:opacity-80`}>
                {court.is_active ? 'Dezaktywuj' : 'Aktywuj'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
