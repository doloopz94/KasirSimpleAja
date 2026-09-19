import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { userService } from '../firebase/userService';
import { isFirebaseConfigured } from '../firebase/config';
import { 
  UserPlus, Edit2, Trash2, ToggleLeft, ToggleRight, 
  Search, X, Save, Shield, Users, AlertCircle 
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    role: 'kasir' as 'admin' | 'kasir' | 'owner',
    fullName: '',
    email: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!isFirebaseConfigured()) {
      setError('Firebase tidak terkonfigurasi. Silakan setup Firebase terlebih dahulu.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const loadedUsers = await userService.getAllUsers();
      
      // Sort by createdAt descending
      loadedUsers.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setUsers(loadedUsers);
      setError('');
    } catch (err) {
      setError('Gagal memuat data user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      pin: '',
      role: 'kasir',
      fullName: '',
      email: '',
      phone: '',
      isActive: true,
    });
    setShowForm(true);
  };

  const openEditForm = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      pin: user.pin,
      role: user.role,
      fullName: user.fullName,
      email: user.email || '',
      phone: user.phone || '',
      isActive: user.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.username || !formData.pin || !formData.fullName) {
      alert('Username, PIN, dan Nama Lengkap harus diisi');
      return;
    }

    if (formData.pin.length < 4) {
      alert('PIN minimal 4 karakter');
      return;
    }

    // Check if username already exists (except when editing the same user)
    const existingUser = users.find(
      u => u.username === formData.username && u.id !== editingUser?.id
    );
    if (existingUser) {
      alert('Username sudah digunakan');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        await userService.updateUser(editingUser.id, formData);
      } else {
        // Create new user
        await userService.createUser(formData);
      }
      
      setShowForm(false);
      await loadUsers(); // Reload users
    } catch (err) {
      alert('Gagal menyimpan user');
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setShowDeleteConfirm(null);
      await loadUsers(); // Reload users
    } catch (err) {
      alert('Gagal menghapus user');
      console.error(err);
    }
  };

  const toggleUserActive = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.toggleUserActive(userId, !currentStatus);
      await loadUsers(); // Reload users
    } catch (err) {
      alert('Gagal mengubah status user');
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' },
      kasir: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Kasir' },
      owner: { bg: 'bg-green-100', text: 'text-green-700', label: 'Owner' },
    };
    const badge = badges[role as keyof typeof badges] || badges.kasir;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data user...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={28} className="text-purple-500" />
            Manajemen Akun
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola akun pengguna aplikasi</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Tambah Akun
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Belum ada akun</p>
          <p className="text-sm mt-1">Klik "Tambah Akun" untuk membuat akun baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`bg-white rounded-xl border-2 p-4 shadow-sm transition-all ${
                user.isActive ? 'border-gray-100' : 'border-red-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleUserActive(user.id, user.isActive)}
                  className="text-gray-400 hover:text-gray-600"
                  title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {user.isActive ? (
                    <ToggleRight size={28} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-red-400" />
                  )}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gray-400" />
                  {getRoleBadge(user.role)}
                </div>
                {user.email && (
                  <p className="text-gray-600 text-xs">📧 {user.email}</p>
                )}
                {user.phone && (
                  <p className="text-gray-600 text-xs">📱 {user.phone}</p>
                )}
                <p className="text-gray-400 text-xs">
                  Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID')}
                </p>
                {user.lastLogin && (
                  <p className="text-gray-400 text-xs">
                    Login terakhir: {new Date(user.lastLogin).toLocaleDateString('id-ID')}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditForm(user)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingUser ? 'Edit Akun' : 'Tambah Akun Baru'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1234"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 4 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="kasir">Kasir</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP (Opsional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="081234567890"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
              >
                <Save size={18} />
                {editingUser ? 'Simpan Perubahan' : 'Tambah Akun'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Hapus Akun?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Akun ini akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
