'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const statusLabels: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: 'Aktif', class: 'bg-green-100 text-green-800' },
  MAINTENANCE: { label: 'Bakımda', class: 'bg-yellow-100 text-yellow-800' },
  INACTIVE: { label: 'Pasif', class: 'bg-earth-100 text-earth-600' },
};

export default function AgingRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', capacity: '', temperature: '', humidity: '', description: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await api.getAgingRooms();
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createAgingRoom({
        name: form.name,
        capacity: parseInt(form.capacity),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        description: form.description || null,
      });
      setShowForm(false);
      setForm({ name: '', capacity: '', temperature: '', humidity: '', description: '' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Olgunlaştırma Odaları</h1>
          <p className="text-earth-500 mt-1">Sıcaklık, nem ve kapasite takibi</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Oda
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-earth-800">Yeni Olgunlaştırma Odası</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Oda Adı" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Kapasite (parti)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="Sıcaklık (°C)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" step="0.1" value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} placeholder="Nem (%)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Açıklama..." className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-earth-100 text-earth-700 rounded-xl font-medium hover:bg-earth-200 transition-colors">İptal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">🏛️</div>
          <p className="text-earth-500">Henüz olgunlaştırma odası tanımlanmamış</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-earth-900">{room.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[room.status]?.class}`}>
                  {statusLabels[room.status]?.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-blue-800">{room.temperature}°C</p>
                  <p className="text-xs text-blue-600">Sıcaklık</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-teal-800">%{room.humidity}</p>
                  <p className="text-xs text-teal-600">Nem</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-earth-500">Doluluk</span>
                <span className="font-medium text-earth-800">{room.batches?.length || 0} / {room.capacity} parti</span>
              </div>
              <div className="mt-2 w-full bg-earth-100 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(((room.batches?.length || 0) / room.capacity) * 100, 100)}%` }}
                ></div>
              </div>
              {room.description && (
                <p className="mt-3 text-xs text-earth-400">{room.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
