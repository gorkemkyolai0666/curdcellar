import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123456', 10);

  await prisma.user.upsert({
    where: { email: 'demo@peynirmahzeni.com.tr' },
    update: {},
    create: {
      email: 'demo@peynirmahzeni.com.tr',
      password: hashedPassword,
      name: 'Mahzen Yöneticisi',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'operator@peynirmahzeni.com.tr' },
    update: {},
    create: {
      email: 'operator@peynirmahzeni.com.tr',
      password: hashedPassword,
      name: 'Ahmet Usta',
      role: 'OPERATOR',
    },
  });

  const recipe1 = await prisma.recipe.upsert({
    where: { id: 'recipe-tulum-01' },
    update: {},
    create: {
      id: 'recipe-tulum-01',
      name: 'Erzincan Tulum Peyniri',
      cheeseType: 'Tulum',
      milkType: 'Koyun Sütü',
      description: 'Geleneksel Erzincan tulum peyniri tarifi. Doğal maya ile hazırlanır.',
      instructions: '1. Süt pastörize edilir\n2. Maya eklenir\n3. Pıhtı kesilir\n4. Tuluma basılır\n5. Olgunlaştırma odasına alınır',
      agingDays: 90,
      temperature: 12,
      humidity: 85,
      isActive: true,
    },
  });

  const recipe2 = await prisma.recipe.upsert({
    where: { id: 'recipe-kasar-01' },
    update: {},
    create: {
      id: 'recipe-kasar-01',
      name: 'Kars Gravyer Kaşarı',
      cheeseType: 'Kaşar',
      milkType: 'İnek Sütü',
      description: 'Kars yöresine özgü gravyer tipi kaşar peyniri.',
      instructions: '1. Taze süt kaynatılır\n2. Starter kültür eklenir\n3. Şekillendirme yapılır\n4. Tuzlama havuzuna alınır\n5. Olgunlaştırmaya bırakılır',
      agingDays: 180,
      temperature: 10,
      humidity: 90,
      isActive: true,
    },
  });

  const recipe3 = await prisma.recipe.upsert({
    where: { id: 'recipe-otlu-01' },
    update: {},
    create: {
      id: 'recipe-otlu-01',
      name: 'Van Otlu Peyniri',
      cheeseType: 'Otlu',
      milkType: 'Koyun Sütü',
      description: 'Van yöresinin meşhur otlu peyniri. Sirmo ve heliz otları ile.',
      instructions: '1. Çiğ koyun sütü süzülür\n2. Doğal maya ile mayalanır\n3. Yöresel otlar eklenir\n4. Kalıplara basılır\n5. Salamura ile olgunlaştırılır',
      agingDays: 120,
      temperature: 8,
      humidity: 80,
      isActive: true,
    },
  });

  const room1 = await prisma.agingRoom.upsert({
    where: { id: 'room-mahzen-01' },
    update: {},
    create: {
      id: 'room-mahzen-01',
      name: 'Ana Mahzen',
      capacity: 500,
      temperature: 12,
      humidity: 85,
      status: 'ACTIVE',
      description: 'Ana olgunlaştırma mahzeni - Tulum ve otlu peynirler için ideal',
    },
  });

  const room2 = await prisma.agingRoom.upsert({
    where: { id: 'room-mahzen-02' },
    update: {},
    create: {
      id: 'room-mahzen-02',
      name: 'Soğuk Oda',
      capacity: 300,
      temperature: 8,
      humidity: 90,
      status: 'ACTIVE',
      description: 'Düşük sıcaklıkta uzun süreli olgunlaştırma odası',
    },
  });

  const room3 = await prisma.agingRoom.upsert({
    where: { id: 'room-mahzen-03' },
    update: {},
    create: {
      id: 'room-mahzen-03',
      name: 'Kuru Depo',
      capacity: 200,
      temperature: 15,
      humidity: 70,
      status: 'ACTIVE',
      description: 'Sert peynirlerin son aşama olgunlaştırması için',
    },
  });

  const batch1 = await prisma.batch.upsert({
    where: { batchCode: 'BT-2026-001' },
    update: {},
    create: {
      batchCode: 'BT-2026-001',
      recipeId: recipe1.id,
      agingRoomId: room1.id,
      milkQuantity: 250,
      startDate: new Date('2026-03-15'),
      expectedEnd: new Date('2026-06-13'),
      status: 'AGING',
      notes: 'İlk parti tulum peyniri - Mart ayı üretimi',
    },
  });

  const batch2 = await prisma.batch.upsert({
    where: { batchCode: 'BT-2026-002' },
    update: {},
    create: {
      batchCode: 'BT-2026-002',
      recipeId: recipe2.id,
      agingRoomId: room2.id,
      milkQuantity: 400,
      startDate: new Date('2026-01-10'),
      expectedEnd: new Date('2026-07-10'),
      status: 'AGING',
      notes: 'Gravyer kaşar - 6 aylık olgunlaştırma',
    },
  });

  const batch3 = await prisma.batch.upsert({
    where: { batchCode: 'BT-2026-003' },
    update: {},
    create: {
      batchCode: 'BT-2026-003',
      recipeId: recipe3.id,
      agingRoomId: room1.id,
      milkQuantity: 180,
      startDate: new Date('2026-02-20'),
      expectedEnd: new Date('2026-06-20'),
      actualEnd: new Date('2026-06-18'),
      status: 'READY',
      notes: 'Van otlu peyniri - Olgunlaşma tamamlandı',
    },
  });

  await prisma.qualityCheck.upsert({
    where: { id: 'qc-001' },
    update: {},
    create: {
      id: 'qc-001',
      batchId: batch3.id,
      checkDate: new Date('2026-06-18'),
      inspector: 'Ahmet Usta',
      texture: 9,
      flavor: 8,
      appearance: 9,
      aroma: 8,
      overallScore: 8.5,
      passed: true,
      notes: 'Mükemmel doku, otlar homojen dağılmış',
    },
  });

  await prisma.inventory.upsert({
    where: { batchId: batch3.id },
    update: {},
    create: {
      batchId: batch3.id,
      quantity: 165,
      unit: 'kg',
      location: 'Soğuk depo - Raf A3',
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { id: 'cust-001' },
    update: {},
    create: {
      id: 'cust-001',
      name: 'Anadolu Gurme Market',
      email: 'satin.alma@anadolugurme.com.tr',
      phone: '+90 212 555 1234',
      address: 'Beşiktaş Çarşı, No: 42',
      city: 'İstanbul',
      taxId: '1234567890',
      isActive: true,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'cust-002' },
    update: {},
    create: {
      id: 'cust-002',
      name: 'Doğal Lezzet Restoran',
      email: 'info@dogallezzet.com.tr',
      phone: '+90 312 444 5678',
      address: 'Kızılay Meydanı, Atatürk Bulvarı No: 88',
      city: 'Ankara',
      taxId: '9876543210',
      isActive: true,
    },
  });

  await prisma.order.upsert({
    where: { orderCode: 'SP-2026-001' },
    update: {},
    create: {
      orderCode: 'SP-2026-001',
      customerId: customer1.id,
      orderDate: new Date('2026-06-15'),
      deliveryDate: new Date('2026-06-22'),
      status: 'CONFIRMED',
      totalAmount: 12500,
      notes: 'Haftalık düzenli sipariş',
      items: {
        create: [
          { product: 'Van Otlu Peyniri', quantity: 25, unit: 'kg', unitPrice: 350, total: 8750 },
          { product: 'Erzincan Tulum', quantity: 15, unit: 'kg', unitPrice: 250, total: 3750 },
        ],
      },
    },
  });

  await prisma.order.upsert({
    where: { orderCode: 'SP-2026-002' },
    update: {},
    create: {
      orderCode: 'SP-2026-002',
      customerId: customer2.id,
      orderDate: new Date('2026-06-18'),
      status: 'PENDING',
      totalAmount: 7000,
      notes: 'Yeni sezon menüsü için deneme siparişi',
      items: {
        create: [
          { product: 'Kars Gravyer Kaşarı', quantity: 20, unit: 'kg', unitPrice: 350, total: 7000 },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
