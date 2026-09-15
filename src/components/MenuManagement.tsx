import React, { useState } from 'react';
import { MenuItem } from '../types';
import { formatCurrency, generateId } from '../store';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, X, Save } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  onSave: (items: MenuItem[]) => void;
}

const MenuManagement: React.FC<Props> = ({ menuItems, onSave }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Makanan Utama',
    description: '',
    available: true,
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['Makanan Utama', 'Minuman', 'Pelengkap', 'Snack', 'Dessert'];

  const openAddForm = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', category: 'Makanan Utama', description: '', available: true });
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      available: item.available,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      const updated = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, name: formData.name, price: parseInt(formData.price), category: formData.category, description: formData.description, available: formData.available }
          : item
      );
      onSave(updated);
    } else {
      const newItem: MenuItem = {
        id: generateId(),
        name: formData.name,
        price: parseInt(formData.price),
        category: formData.category,
        description: formData.description,
        available: formData.available,
      };
      onSave([...menuItems, newItem]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      onSave(menuItems.filter(item => item.id !== id));
    }
  };

  const toggleAvailability = (id: string) => {
    const updated = menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Menu</h1>
          <p className="text-gray-500 text-sm mt-1">Tambah dan kelola daftar menu makanan</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Menu
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${item.available ? 'border-gray-100' : 'border-red-100 opacity-60'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {item.category}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                <p className="text-lg font-bold text-green-600 mt-2">{formatCurrency(item.price)}</p>
              </div>
              <button
                onClick={() => toggleAvailability(item.id)}
                className="text-gray-400 hover:text-gray-600"
                title={item.available ? 'Nonaktifkan' : 'Aktifkan'}
              >
                {item.available ? (
                  <ToggleRight size={28} className="text-green-500" />
                ) : (
                  <ToggleLeft size={28} className="text-red-400" />
                )}
              </button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => openEditForm(item)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Menu tidak ditemukan</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Nasi Goreng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                  placeholder="Deskripsi singkat menu..."
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
              >
                <Save size={18} />
                {editingItem ? 'Simpan Perubahan' : 'Tambah Menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
