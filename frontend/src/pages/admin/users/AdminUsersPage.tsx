import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import type { User } from '@/types';

interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersApi.getUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Błąd ładowania użytkowników:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'user',
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        // Update user (without password)
        const { password, ...updateData } = formData;
        await usersApi.updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        await usersApi.createUser(formData);
      }
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd podczas zapisywania użytkownika');
    }
  };

  const handleDeactivate = async (userId: string, userEmail: string) => {
    if (!confirm(`Czy na pewno chcesz dezaktywować użytkownika ${userEmail}?`)) return;

    try {
      await usersApi.deactivateUser(userId);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Błąd podczas dezaktywacji użytkownika');
    }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Ładowanie...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Zarządzanie użytkownikami</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Dodaj użytkownika
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Imię</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nazwisko</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rola</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data rejestracji</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{user.first_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{user.last_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'}`}>
                    {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{new Date(user.date_joined).toLocaleDateString('pl-PL')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeactivate(user.id, user.email)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Dezaktywuj
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {editingUser ? 'Edytuj użytkownika' : 'Dodaj użytkownika'}
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                  required
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Hasło</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                    required={!editingUser}
                    minLength={8}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Imię</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nazwisko</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Rola</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground rounded"
                >
                  <option value="user">Użytkownik</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  {editingUser ? 'Zapisz zmiany' : 'Dodaj użytkownika'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded hover:bg-secondary/80"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
