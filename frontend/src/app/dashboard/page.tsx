'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [batchStats, setBatchStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bs, os, rs] = await Promise.all([
          api.getBatchStats(),
          api.getOrderStats(),
          api.getAgingRooms(),
        ]);
        setBatchStats(bs);
        setOrderStats(os);
        setRooms(rs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-earth-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Toplam Parti', value: batchStats?.total || 0, icon: '📦', color: 'bg-brand-100 text-brand-800' },
    { label: 'Olgunlaşan', value: batchStats?.aging || 0, icon: '🧀', color: 'bg-amber-100 text-amber-800' },
    { label: 'Hazır Ürün', value: batchStats?.ready || 0, icon: '✅', color: 'bg-green-100 text-green-800' },
    { label: 'Toplam Gelir', value: formatCurrency(orderStats?.revenue || 0), icon: '💰', color: 'bg-blue-100 text-blue-800' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-earth-900">Gösterge Paneli</h1>
        <p className="text-earth-500 mt-1">Üretim ve satış özetiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} text-lg`}>
                {card.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-earth-900">{card.value}</p>
            <p className="text-sm text-earth-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
          <h2 className="text-lg font-semibold text-earth-900 mb-4">Sipariş Durumu</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-earth-600">Bekleyen</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {orderStats?.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-earth-600">Onaylanan</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {orderStats?.confirmed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-earth-600">Teslim Edilen</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {orderStats?.delivered || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm">
          <h2 className="text-lg font-semibold text-earth-900 mb-4">Olgunlaştırma Odaları</h2>
          <div className="space-y-3">
            {rooms.length === 0 ? (
              <p className="text-earth-400 text-sm">Henüz oda tanımlanmamış</p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-earth-800">{room.name}</p>
                    <p className="text-xs text-earth-500">{room.temperature}°C / %{room.humidity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-earth-700">
                      {room.batches?.length || 0} / {room.capacity}
                    </p>
                    <p className="text-xs text-earth-400">parti</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
