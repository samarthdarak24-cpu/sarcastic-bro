// ========================================================================
// AgriTrust — Comprehensive Seed Script
// Realistic data for Marathwada region, Maharashtra
// ========================================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AgriTrust database...\n');

  // ─── CLEAN EXISTING DATA ────────────────────────────────────────────
  console.log('🧹 Cleaning existing data...');
  await prisma.farmerEarning.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.escrowTransaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.qualityCertificate.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.aggregatedLot.deleteMany();
  await prisma.fPOFarmer.deleteMany();
  await prisma.fPO.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.message.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.user.deleteMany();

  // ─── USERS ──────────────────────────────────────────────────────────
  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('Test@1234', 12);

  // FPO Admin
  const fpoAdmin = await prisma.user.create({
    data: {
      name: 'Rajendra Patil',
      phone: '9876543210',
      email: 'fpo@test.com',
      passwordHash,
      role: 'FPO',
      language: 'mr',
      kycVerified: true,
      bankAccount: '1234567890123',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
    },
  });

  // Farmers (Marathi names)
  const farmerData = [
    { name: 'Suresh Jadhav',    phone: '9876543211', email: 'farmer@test.com',  district: 'Nanded',  lang: 'mr' },
    { name: 'Ganesh Bhosale',   phone: '9876543212', email: 'ganesh@test.com',  district: 'Nanded',  lang: 'mr' },
    { name: 'Prakash Shinde',   phone: '9876543213', email: 'prakash@test.com', district: 'Latur',   lang: 'hi' },
    { name: 'Dnyaneshwar More', phone: '9876543214', email: 'dmore@test.com',   district: 'Pune',    lang: 'mr' },
    { name: 'Ashok Deshmukh',   phone: '9876543215', email: 'ashok@test.com',   district: 'Nashik',  lang: 'mr' },
  ];

  const farmers = [];
  for (const f of farmerData) {
    const user = await prisma.user.create({
      data: {
        name: f.name,
        phone: f.phone,
        email: f.email,
        passwordHash,
        role: 'FARMER',
        language: f.lang,
        kycVerified: true,
        aadhaar: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        bankAccount: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        ifsc: 'MAHB0000' + Math.floor(100 + Math.random() * 900),
        bankName: 'Maharashtra Gramin Bank',
      },
    });
    farmers.push({ user, district: f.district });
  }

  // Buyers
  const buyerData = [
    { name: 'Mahesh Agarwal', phone: '9876543220', email: 'buyer@test.com',  gst: '27AADCM1234F1Z5', company: 'Agarwal Agro Industries' },
    { name: 'NutriGrain Pvt Ltd', phone: '9876543221', email: 'nutrigrain@test.com', gst: '27AABCN9876F2Z3', company: 'NutriGrain Pvt Ltd' },
  ];

  const buyers = [];
  for (const b of buyerData) {
    const user = await prisma.user.create({
      data: {
        name: b.name,
        phone: b.phone,
        email: b.email,
        passwordHash,
        role: 'BUYER',
        gst: b.gst,
        kycVerified: true,
        language: 'en',
        bankAccount: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank',
      },
    });
    buyers.push(user);
  }

  // ─── WALLETS ────────────────────────────────────────────────────────
  console.log('💰 Creating wallets...');
  await prisma.wallet.create({ data: { userId: fpoAdmin.id, balance: 50000 } });
  for (const f of farmers) {
    await prisma.wallet.create({ data: { userId: f.user.id, balance: 0 } });
  }
  // Buyers get initial funds
  const buyerWallets = [];
  for (const b of buyers) {
    const w = await prisma.wallet.create({ data: { userId: b.id, balance: 500000 } });
    buyerWallets.push(w);
  }

  // Add wallet transaction for buyer funds
  await prisma.walletTransaction.create({
    data: {
      walletId: buyerWallets[0].id,
      type: 'ADD_FUNDS',
      amount: 500000,
      balanceBefore: 0,
      balanceAfter: 500000,
      description: 'Initial deposit via NEFT',
    },
  });

  // ─── FARMS ──────────────────────────────────────────────────────────
  console.log('🌾 Creating farms...');
  const farmDetails = [
    { district: 'Nanded',  state: 'Maharashtra', location: 'Hadgaon, Nanded',     area: 5.5,  soil: 'Black Cotton', irrigation: 'Drip' },
    { district: 'Nanded',  state: 'Maharashtra', location: 'Biloli, Nanded',      area: 3.2,  soil: 'Black Cotton', irrigation: 'Borewell' },
    { district: 'Latur',   state: 'Maharashtra', location: 'Ausa, Latur',         area: 8.0,  soil: 'Medium Black', irrigation: 'Canal' },
    { district: 'Pune',    state: 'Maharashtra', location: 'Junnar, Pune',        area: 12.0, soil: 'Red Laterite', irrigation: 'Well' },
    { district: 'Nashik',  state: 'Maharashtra', location: 'Dindori, Nashik',     area: 6.5,  soil: 'Red Soil',     irrigation: 'Drip' },
  ];

  for (let i = 0; i < farmers.length; i++) {
    await prisma.farm.create({
      data: {
        farmerId: farmers[i].user.id,
        location: farmDetails[i].location,
        district: farmDetails[i].district,
        state: farmDetails[i].state,
        areaAcres: farmDetails[i].area,
        soilType: farmDetails[i].soil,
        irrigationType: farmDetails[i].irrigation,
        photos: JSON.stringify([]),
      },
    });
  }

  // ─── FPO ────────────────────────────────────────────────────────────
  console.log('🏢 Creating FPO...');
  const fpo = await prisma.fPO.create({
    data: {
      adminUserId: fpoAdmin.id,
      name: 'Marathwada Kisan Sangha',
      registrationNo: 'MH-FPO-2024-NAN-001',
      bankAccount: '9876543210123',
      ifsc: 'SBIN0005678',
      district: 'Nanded',
      state: 'Maharashtra',
    },
  });

  // ─── FPO FARMERS ────────────────────────────────────────────────────
  console.log('👨‍🌾 Onboarding farmers to FPO...');
  const fpoFarmers = [];
  for (const f of farmers) {
    const fpoFarmer = await prisma.fPOFarmer.create({
      data: {
        fpoId: fpo.id,
        name: f.user.name,
        phone: f.user.phone,
        aadhaar: f.user.aadhaar || '1234 5678 9012',
        bankAccount: f.user.bankAccount,
        ifsc: f.user.ifsc,
        district: f.district,
        photos: JSON.stringify([]),
      },
    });
    fpoFarmers.push(fpoFarmer);
  }

  // ─── CROPS ──────────────────────────────────────────────────────────
  console.log('🌿 Listing crops...');
  const cropListings = [
    { farmer: 0, name: 'Wheat',   cat: 'Grains',      variety: 'Lokwan',         qty: 500,  price: 28, grade: 'A' },
    { farmer: 0, name: 'Soybean', cat: 'Pulses',      variety: 'JS-335',         qty: 300,  price: 52, grade: 'A' },
    { farmer: 1, name: 'Wheat',   cat: 'Grains',      variety: 'Lokwan',         qty: 800,  price: 27, grade: 'A' },
    { farmer: 1, name: 'Cotton',  cat: 'Fibers',      variety: 'Bt Cotton',      qty: 200,  price: 65, grade: 'B' },
    { farmer: 2, name: 'Soybean', cat: 'Pulses',      variety: 'JS-335',         qty: 600,  price: 50, grade: 'A' },
    { farmer: 2, name: 'Cotton',  cat: 'Fibers',      variety: 'Bt Cotton',      qty: 400,  price: 68, grade: 'A' },
    { farmer: 3, name: 'Onion',   cat: 'Vegetables',  variety: 'Nasik Red',      qty: 1500, price: 18, grade: 'A' },
    { farmer: 3, name: 'Tomato',  cat: 'Vegetables',  variety: 'Hybrid Abhijeet',qty: 800,  price: 22, grade: 'B' },
    { farmer: 4, name: 'Rice',    cat: 'Grains',      variety: 'Kolam',          qty: 1000, price: 38, grade: 'A' },
    { farmer: 4, name: 'Onion',   cat: 'Vegetables',  variety: 'Nasik Red',      qty: 700,  price: 20, grade: 'B' },
  ];

  const crops = [];
  for (const c of cropListings) {
    const crop = await prisma.crop.create({
      data: {
        farmerId: farmers[c.farmer].user.id,
        fpoFarmerId: fpoFarmers[c.farmer].id,
        fpoId: fpo.id,
        cropName: c.name,
        category: c.cat,
        variety: c.variety,
        quantity: c.qty,
        pricePerKg: c.price,
        grade: c.grade,
        status: 'LISTED',
      },
    });
    crops.push(crop);
  }

  // ─── AGGREGATED LOTS ────────────────────────────────────────────────
  console.log('📦 Creating aggregated lots...');

  // Aggregate Wheat (crops[0] + crops[2])
  const wheatLot = await prisma.aggregatedLot.create({
    data: {
      fpoId: fpo.id,
      cropName: 'Wheat',
      totalQuantity: 1300,
      pricePerKg: 27.38,
      status: 'LISTED',
    },
  });
  await prisma.crop.updateMany({
    where: { id: { in: [crops[0].id, crops[2].id] } },
    data: { isAggregated: true, aggregatedLotId: wheatLot.id },
  });

  // Aggregate Soybean (crops[1] + crops[4])
  const soybeanLot = await prisma.aggregatedLot.create({
    data: {
      fpoId: fpo.id,
      cropName: 'Soybean',
      totalQuantity: 900,
      pricePerKg: 50.67,
      status: 'LISTED',
    },
  });
  await prisma.crop.updateMany({
    where: { id: { in: [crops[1].id, crops[4].id] } },
    data: { isAggregated: true, aggregatedLotId: soybeanLot.id },
  });

  // Aggregate Onion (crops[6] + crops[9])
  const onionLot = await prisma.aggregatedLot.create({
    data: {
      fpoId: fpo.id,
      cropName: 'Onion',
      totalQuantity: 2200,
      pricePerKg: 18.64,
      status: 'LISTED',
    },
  });
  await prisma.crop.updateMany({
    where: { id: { in: [crops[6].id, crops[9].id] } },
    data: { isAggregated: true, aggregatedLotId: onionLot.id },
  });

  // ─── ORDERS ────────────────────────────────────────────────────────
  console.log('📋 Creating orders...');

  // Completed order (Wheat lot → delivered + escrow released)
  const completedOrder = await prisma.order.create({
    data: {
      buyerId: buyers[0].id,
      lotId: wheatLot.id,
      quantity: 1300,
      totalAmount: 1300 * 27.38,
      status: 'DELIVERED',
      escrowStatus: 'RELEASED',
      deliveryAddress: 'Agarwal Agro Industries, MIDC Waluj, Aurangabad 431136',
    },
  });

  // Escrow transaction for completed order
  await prisma.escrowTransaction.create({
    data: {
      orderId: completedOrder.id,
      buyerId: buyers[0].id,
      sellerId: fpoAdmin.id,
      amount: completedOrder.totalAmount,
      status: 'RELEASED',
      heldAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      releasedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Farmer earnings for completed order
  const wheatFarmers = [
    { id: farmers[0].user.id, qty: 500 },
    { id: farmers[1].user.id, qty: 800 },
  ];
  for (const wf of wheatFarmers) {
    const share = (wf.qty / 1300) * completedOrder.totalAmount;
    const fee = share * 0.02;
    await prisma.farmerEarning.create({
      data: {
        farmerId: wf.id,
        orderId: completedOrder.id,
        amount: share - fee,
        platformFee: fee,
        status: 'COMPLETED',
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Pending order (Soybean lot → confirmed, escrow held)
  const pendingOrder = await prisma.order.create({
    data: {
      buyerId: buyers[1].id,
      lotId: soybeanLot.id,
      quantity: 900,
      totalAmount: 900 * 50.67,
      status: 'IN_TRANSIT',
      escrowStatus: 'HELD',
      deliveryAddress: 'NutriGrain Processing Plant, Satara Road, Pune 411009',
    },
  });

  await prisma.escrowTransaction.create({
    data: {
      orderId: pendingOrder.id,
      buyerId: buyers[1].id,
      sellerId: fpoAdmin.id,
      amount: pendingOrder.totalAmount,
      status: 'HELD',
      heldAt: new Date(),
    },
  });

  // ─── MARKET PRICES (6 months × 6 crops × 4 districts) ──────────────
  console.log('📊 Seeding market price history...');

  const cropPrices: Record<string, { base: number; variance: number; variety: string }> = {
    Wheat:   { base: 26, variance: 5,  variety: 'Lokwan' },
    Rice:    { base: 36, variance: 6,  variety: 'Kolam' },
    Soybean: { base: 48, variance: 8,  variety: 'JS-335' },
    Cotton:  { base: 62, variance: 10, variety: 'Bt Cotton' },
    Onion:   { base: 15, variance: 12, variety: 'Nasik Red' },
    Tomato:  { base: 18, variance: 15, variety: 'Hybrid' },
  };

  const districts = ['Nanded', 'Latur', 'Pune', 'Nashik'];
  const now = new Date();

  for (const [cropName, info] of Object.entries(cropPrices)) {
    for (const district of districts) {
      for (let day = 0; day < 180; day++) {
        const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        // Simulate price fluctuation with seasonal trend
        const seasonalFactor = 1 + 0.1 * Math.sin((day / 30) * Math.PI);
        const noise = (Math.random() - 0.5) * info.variance;
        const districtFactor = district === 'Pune' ? 1.05 : district === 'Nashik' ? 1.03 : 1;
        const price = Math.round((info.base * seasonalFactor + noise) * districtFactor * 100) / 100;

        await prisma.marketPrice.create({
          data: {
            cropName,
            variety: info.variety,
            grade: 'A',
            pricePerKg: Math.max(price, info.base * 0.6), // floor at 60% of base
            district,
            recordedAt: date,
          },
        });
      }
    }
  }

  // ─── QUALITY CERTIFICATES ──────────────────────────────────────────
  console.log('📜 Adding quality certificates...');
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[0].id,
      uploadedBy: fpoAdmin.id,
      fileUrl: '/uploads/cert-wheat-gradeA-sample.pdf',
      verifiedByFPO: true,
      aiScore: 92.5,
    },
  });
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[1].id,
      uploadedBy: fpoAdmin.id,
      fileUrl: '/uploads/cert-soybean-gradeA-sample.pdf',
      verifiedByFPO: true,
      aiScore: 88.0,
    },
  });

  // ─── CHAT MESSAGES ────────────────────────────────────────────────
  console.log('💬 Adding sample chat messages...');
  const chatMessages = [
    { from: buyers[0].id, to: fpoAdmin.id, content: 'Namaste! I need 1300kg Grade-A Lokwan wheat. Can you provide quality certificate?', order: completedOrder.id },
    { from: fpoAdmin.id, to: buyers[0].id, content: 'Namaskar ji! Yes, certificate uploaded. Our wheat is freshly harvested from Hadgaon and Biloli farms.', order: completedOrder.id },
    { from: buyers[0].id, to: fpoAdmin.id, content: 'Great. I have placed the order. Please dispatch within 3 days.', order: completedOrder.id },
    { from: fpoAdmin.id, to: buyers[0].id, content: 'Order dispatched today morning via truck. Expected delivery in 2 days. Invoice attached.', order: completedOrder.id },
    { from: buyers[1].id, to: fpoAdmin.id, content: 'We are interested in your soybean lot. What is the moisture content?', order: pendingOrder.id },
    { from: fpoAdmin.id, to: buyers[1].id, content: 'Moisture is 10-12%. Lab-tested certificate available. Shall I share it?', order: pendingOrder.id },
  ];

  for (let i = 0; i < chatMessages.length; i++) {
    const m = chatMessages[i];
    await prisma.message.create({
      data: {
        senderId: m.from,
        receiverId: m.to,
        content: m.content,
        orderId: m.order,
        read: i < 4,
        createdAt: new Date(now.getTime() - (chatMessages.length - i) * 3600000),
      },
    });
  }

  // ─── SUMMARY ────────────────────────────────────────────────────────
  console.log('\n✅ Seeding complete!\n');
  console.log('═══════════════════════════════════════════');
  console.log('  📋 Login Credentials (all password: Test@1234)');
  console.log('═══════════════════════════════════════════');
  console.log('  FPO Admin:  fpo@test.com    / 9876543210');
  console.log('  Farmer 1:   farmer@test.com / 9876543211');
  console.log('  Buyer 1:    buyer@test.com  / 9876543220');
  console.log('═══════════════════════════════════════════');
  console.log(`  Users: 8 | Farms: 5 | FPO: 1 | Crops: 10`);
  console.log(`  Lots: 3 | Orders: 2 | Market Prices: ${180 * 6 * 4}`);
  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
