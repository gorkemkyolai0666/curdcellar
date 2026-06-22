'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [i, s] = await Promise.all([api.getInventory(), api.getInventorySummary()]);
      setItems(i);
      setSummary(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-earth-900">Stok Yönetimi</h1>
        <p className="text-earth-500 mt-1">Hazır ürün stoku ve dağılımı</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
            <p className="text-sm text-earth-500">Toplam Stok</p>
            <p className="text-3xl font-bold text-earth-900 mt-1">{summary.totalQuantity} kg</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
            <p className="text-sm text-earth-500">Ürün Çeşidi</p>
            <p className="text-3xl font-bold text-earth-900 mt-1">{Object.keys(summary.byType || {}).length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
            <p className="text-sm text-earth-500">Stok Kalemi</p>
            <p className="text-3xl font-bold text-earth-900 mt-1">{summary.itemCount}</p>
          </div>
        </div>
      )}

      {summary?.byType && Object.keys(summary.byType).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
          <h2 className="text-lg font-semibold text-earth-900 mb-4">Türe Göre Dağılım</h2>
          <div className="space-y-3">
            {Object.entries(summary.byType).map(([type, qty]: [string, any]) => (
              <div key={type} className="flex items-center gap-4">
                <span className="text-sm font-medium text-earth-700 w-32">{type}</span>
                <div className="flex-1 bg-earth-100 rounded-full h-4">
                  <div
                    className="bg-brand-600 h-4 rounded-full transition-all"
                    style={{ width: `${(qty / summary.totalQuantity) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-earth-800 w-20 text-right">{qty} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse"></div>)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-earth-100 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-earth-500">Henüz stok kaydı bulunmuyor</p>
          <p className="text-earth-400 text-sm mt-1">Partiler hazır durumuna geçtiğinde stok kaydı oluşturulur</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-earth-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-earth-50 border-b border-earth-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Parti</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Miktar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase">Konum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-earth-800">{item.batch?.batchCode}</td>
                  <td className="px-6 py-4 text-sm text-earth-700">{item.batch?.recipe?.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-earth-900">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4 text-sm text-earth-500">{item.location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
