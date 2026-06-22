'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function QualityPage() {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [form, setForm] = useState({ batchId: '', inspector: '', texture: '', flavor: '', appearance: '', aroma: '', notes: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [c, b] = await Promise.all([api.getQualityChecks(), api.getBatches()]);
      setChecks(c);
      setBatches(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createQualityCheck({
        batchId: form.batchId,
        inspector: form.inspector,
        checkDate: new Date().toISOString(),
        texture: parseInt(form.texture),
        flavor: parseInt(form.flavor),
        appearance: parseInt(form.appearance),
        aroma: parseInt(form.aroma),
        notes: form.notes || null,
      });
      setShowForm(false);
      setForm({ batchId: '', inspector: '', texture: '', flavor: '', appearance: '', aroma: '', notes: '' });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Kalite Kontrol</h1>
          <p className="text-earth-500 mt-1">Tat, doku, görünüm ve aroma değerlendirmesi</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-800/25">
          + Yeni Kontrol
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-earth-800">Yeni Kalite Kontrolü</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required>
              <option value="">Parti Seçin</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.batchCode} - {b.recipe?.name}</option>)}
            </select>
            <input value={form.inspector} onChange={(e) => setForm({ ...form, inspector: e.target.value })} placeholder="Denetçi Adı" className="px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-earth-500 mb-1 block">Doku (1-10)</label>
              <input type="number" min="1" max="10" value={form.texture} onChange={(e) => setForm({ ...form, texture: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div>
              <label className="text-xs text-earth-500 mb-1 block">Tat (1-10)</label>
              <input type="number" min="1" max="10" value={form.flavor} onChange={(e) => setForm({ ...form, flavor: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div>
              <label className="text-xs text-earth-500 mb-1 block">Görünüm (1-10)</label>
              <input type="number" min="1" max="10" value={form.appearance} onChange={(e) => setForm({ ...form, appearance: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div>
              <label className="text-xs text-earth-500 mb-1 block">Aroma (1-10)</label>
              <input type="number" min="1" max="10" value={form.aroma} onChange={(e) => setForm({ ...form, aroma: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notlar..." className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50 text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-brand-500" rows={2} />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2.5 bg-brand-800 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-earth-100 text-earth-700 rounded-xl font-medium hover:bg-earth-200 transition-colors">İptal</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : checks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-earth-500">Henüz kalite kontrolü yapılmamış</p>
        </div>
      ) : (
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="bg-white rounded-2xl p-5 border border-earth-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${check.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className="text-lg">{check.passed ? '✅' : '❌'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-earth-900">{check.batch?.batchCode} — {check.batch?.recipe?.name}</p>
                    <p className="text-sm text-earth-500">Denetçi: {check.inspector} • {formatDate(check.checkDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div><p className="text-xs text-earth-400">Doku</p><p className="font-bold text-earth-800">{check.texture}</p></div>
                    <div><p className="text-xs text-earth-400">Tat</p><p className="font-bold text-earth-800">{check.flavor}</p></div>
                    <div><p className="text-xs text-earth-400">Görünüm</p><p className="font-bold text-earth-800">{check.appearance}</p></div>
                    <div><p className="text-xs text-earth-400">Aroma</p><p className="font-bold text-earth-800">{check.aroma}</p></div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {check.overallScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
