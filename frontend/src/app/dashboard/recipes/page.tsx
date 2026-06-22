'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', cheeseType: '', milkType: '', agingDays: '', temperature: '', humidity: '', description: '', instructions: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await api.getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createRecipe({
        name: form.name,
        cheeseType: form.cheeseType,
        milkType: form.milkType,
        agingDays: parseInt(form.agingDays),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        description: form.description || null,
        instructions: form.instructions || null,
      });
      setShowForm(false);
      setForm({ name: '', cheeseType: '', milkType: '', agingDays: '', temperature: '', humidity: '', description: '', instructions: '' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Tarifler</h1>
          <p className="text-earth-500 mt-1">Peynir tarifleri ve formülleri</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Tarif
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-earth-800">Yeni Peynir Tarifi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tarif Adı" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input value={form.cheeseType} onChange={(e) => setForm({ ...form, cheeseType: e.target.value })} placeholder="Peynir Türü (Tulum, Kaşar...)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input value={form.milkType} onChange={(e) => setForm({ ...form, milkType: e.target.value })} placeholder="Süt Türü (Koyun, İnek...)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" value={form.agingDays} onChange={(e) => setForm({ ...form, agingDays: e.target.value })} placeholder="Olgunlaşma Süresi (gün)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="Sıcaklık (°C)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            <input type="number" step="0.1" value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} placeholder="Nem (%)" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Açıklama..." className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} />
          <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Yapım talimatları..." className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={3} />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-earth-100 text-earth-700 rounded-xl font-medium hover:bg-earth-200 transition-colors">İptal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-earth-500">Henüz tarif eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-earth-900">{recipe.name}</h3>
                  <p className="text-sm text-earth-500">{recipe.cheeseType} • {recipe.milkType}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${recipe.isActive ? 'bg-green-100 text-green-800' : 'bg-earth-100 text-earth-600'}`}>
                  {recipe.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              {recipe.description && (
                <p className="text-sm text-earth-600 mb-4 line-clamp-2">{recipe.description}</p>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-earth-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-earth-800">{recipe.agingDays}</p>
                  <p className="text-xs text-earth-500">gün</p>
                </div>
                <div className="bg-earth-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-earth-800">{recipe.temperature}°C</p>
                  <p className="text-xs text-earth-500">sıcaklık</p>
                </div>
                <div className="bg-earth-50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-earth-800">%{recipe.humidity}</p>
                  <p className="text-xs text-earth-500">nem</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-earth-100 flex items-center justify-between">
                <span className="text-xs text-earth-400">{recipe._count?.batches || 0} parti üretildi</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
