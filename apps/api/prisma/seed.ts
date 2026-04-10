// ========================================================================
// AgriTrust — Comprehensive Seed Script
// Realistic data for Marathwada region, Maharashtra
// ========================================================================

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AgriTrust database...\n');

  // ─── CLEAN EXISTING DATA ────────────────────────────────────────────
  console.log('🧹 Cleaning existing data...');
  await prisma.fPOLinkRequest.deleteMany();
  await prisma.logisticsEvent.deleteMany();
  await prisma.fPOLogistics.deleteMany();
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

  // ─── AUTHENTICATION ────────────────────────────────────────────────
  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('Farmer123', 10);

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
      kycStatus: 'VERIFIED',
      bankAccount: '1234567890123',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
    },
  });

  // Farmers (Marathi names)
  const farmerData = [
    { name: 'Suresh Jadhav',    phone: '9876543211', email: 'farmer@test.com',  district: 'Nanded',  lang: 'mr' as const },
    { name: 'Ganesh Bhosale',   phone: '9876543212', email: 'ganesh@test.com',  district: 'Nanded',  lang: 'mr' as const },
    { name: 'Prakash Shinde',   phone: '9876543213', email: 'prakash@test.com', district: 'Latur',   lang: 'hi' as const },
    { name: 'Dnyaneshwar More', phone: '9876543214', email: 'dmore@test.com',   district: 'Pune',    lang: 'mr' as const },
    { name: 'Ashok Deshmukh',   phone: '9876543215', email: 'ashok@test.com',   district: 'Nashik',  lang: 'mr' as const },
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
        kycStatus: 'VERIFIED',
        aadhaar: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        bankAccount: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        ifsc: 'MAHB0000' + Math.floor(100 + Math.random() * 900),
        bankName: 'Maharashtra Gramin Bank',
      },
    });
    farmers.push({ user, district: f.district });

    // Seed some documents for the first farmer
    // Commented out temporarily to avoid errors
    /*
    if (farmers.length === 1) {
      await prisma.kYCDocument.createMany({
        data: [
          {
            userId: user.id,
            type: 'AADHAAR',
            documentUrl: 'https://res.cloudinary.com/agritrust/image/upload/v1/kyc/sample_aadhaar.png',
            verifiedAt: new Date()
          },
          {
            userId: user.id,
            type: 'BANK_PASSBOOK',
            documentUrl: 'https://res.cloudinary.com/agritrust/image/upload/v1/kyc/sample_passbook.png',
            verifiedAt: new Date()
          }
        ]
      });
    }
    */
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
        photos: [],
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
        photos: [],
      },
    });
    fpoFarmers.push(fpoFarmer);
  }

  // ─── CROPS ──────────────────────────────────────────────────────────
  console.log('🌿 Listing crops...');
  const cropListings = [
    { farmer: 0, name: 'Wheat',   cat: 'Grains',      variety: 'Lokwan',         qty: 500,  price: 28, grade: 'A' as const },
    { farmer: 0, name: 'Soybean', cat: 'Pulses',      variety: 'JS-335',         qty: 300,  price: 52, grade: 'A' as const },
    { farmer: 1, name: 'Wheat',   cat: 'Grains',      variety: 'Lokwan',         qty: 800,  price: 27, grade: 'A' as const },
    { farmer: 1, name: 'Cotton',  cat: 'Fibers',      variety: 'Bt Cotton',      qty: 200,  price: 65, grade: 'B' as const },
    { farmer: 2, name: 'Soybean', cat: 'Pulses',      variety: 'JS-335',         qty: 600,  price: 50, grade: 'A' as const },
    { farmer: 2, name: 'Cotton',  cat: 'Fibers',      variety: 'Bt Cotton',      qty: 400,  price: 68, grade: 'A' as const },
    { farmer: 3, name: 'Onion',   cat: 'Vegetables',  variety: 'Nasik Red',      qty: 1500, price: 18, grade: 'A' as const },
    { farmer: 3, name: 'Tomato',  cat: 'Vegetables',  variety: 'Hybrid Abhijeet',qty: 800,  price: 22, grade: 'B' as const },
    { farmer: 4, name: 'Rice',    cat: 'Grains',      variety: 'Kolam',          qty: 1000, price: 38, grade: 'A' as const },
    { farmer: 4, name: 'Onion',   cat: 'Vegetables',  variety: 'Nasik Red',      qty: 700,  price: 20, grade: 'B' as const },
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

  // ─── ORDER TRACKING EVENTS ─────────────────────────────────────────
  console.log('📍 Creating order tracking events...');

  // Tracking events for completed order
  const completedOrderEvents = [
    {
      orderId: completedOrder.id,
      status: 'PLACED',
      location: 'Nanded, Maharashtra',
      latitude: 19.1383,
      longitude: 77.3210,
      description: 'Order placed successfully',
      updatedBy: buyers[0].id,
      updatedByRole: Role.BUYER,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'CONFIRMED',
      location: 'Nanded FPO Office',
      latitude: 19.1383,
      longitude: 77.3210,
      description: 'Order confirmed by FPO. Preparing for dispatch.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'PACKED',
      location: 'Nanded FPO Warehouse',
      latitude: 19.1383,
      longitude: 77.3210,
      description: 'Wheat lot packed and quality checked. Ready for pickup.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'PICKED_UP',
      location: 'Nanded Transport Hub',
      latitude: 19.1383,
      longitude: 77.3210,
      description: 'Shipment picked up by carrier. Vehicle No: MH-26-AB-1234',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'IN_TRANSIT',
      location: 'Jalna Checkpoint',
      latitude: 19.8410,
      longitude: 75.8810,
      description: 'In transit. Temperature maintained at 22°C.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'OUT_FOR_DELIVERY',
      location: 'Aurangabad Distribution Center',
      latitude: 19.8762,
      longitude: 75.3433,
      description: 'Out for delivery. Expected arrival in 2 hours.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: completedOrder.id,
      status: 'DELIVERED',
      location: 'Agarwal Agro Industries, Aurangabad',
      latitude: 19.8762,
      longitude: 75.3433,
      description: 'Delivered successfully. Quality verified by buyer.',
      updatedBy: buyers[0].id,
      updatedByRole: Role.BUYER,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const event of completedOrderEvents) {
    await prisma.orderTrackingEvent.create({ 
      data: {
        ...event,
        updatedByRole: event.updatedByRole as any,
      }
    });
  }

  // Tracking events for pending order (in transit)
  const pendingOrderEvents = [
    {
      orderId: pendingOrder.id,
      status: 'PLACED',
      location: 'Latur, Maharashtra',
      latitude: 18.4088,
      longitude: 76.5604,
      description: 'Order placed successfully',
      updatedBy: buyers[1].id,
      updatedByRole: Role.BUYER,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: pendingOrder.id,
      status: 'CONFIRMED',
      location: 'Latur FPO Office',
      latitude: 18.4088,
      longitude: 76.5604,
      description: 'Order confirmed. Aggregating soybean from farmers.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: pendingOrder.id,
      status: 'PACKED',
      location: 'Latur FPO Warehouse',
      latitude: 18.4088,
      longitude: 76.5604,
      description: 'Soybean lot packed. Quality certificate attached.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      orderId: pendingOrder.id,
      status: 'PICKED_UP',
      location: 'Latur Transport Hub',
      latitude: 18.4088,
      longitude: 76.5604,
      description: 'Picked up by carrier. Vehicle No: MH-22-CD-5678',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      orderId: pendingOrder.id,
      status: 'IN_TRANSIT',
      location: 'Solapur Highway',
      latitude: 17.6599,
      longitude: 75.9064,
      description: 'In transit to Pune. ETA: 6 hours.',
      updatedBy: fpoAdmin.id,
      updatedByRole: Role.FPO,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];

  for (const event of pendingOrderEvents) {
    await prisma.orderTrackingEvent.create({ 
      data: {
        ...event,
        updatedByRole: event.updatedByRole as any,
      }
    });
  }

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

  const marketDistricts = ['Nanded', 'Latur', 'Pune', 'Nashik'];
  const now = new Date();

  for (const [cropName, info] of Object.entries(cropPrices)) {
    for (const district of marketDistricts) {
      for (let day = 0; day < 180; day++) {
        const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        // Simulate price fluctuation with seasonal trend
        const seasonalFactor = 1 + 0.1 * Math.sin((day / 30) * Math.PI);
        const noise = (Math.random() - 0.5) * info.variance;
        const districtFactor = district === 'Pune' ? 1.05 : district === 'Nashik' ? 1.03 : 1;
        const modalPrice = Math.round(Math.max((info.base * seasonalFactor + noise) * districtFactor, info.base * 0.6) * 100) / 100;
        const minPrice = Math.round(modalPrice * (0.8 + Math.random() * 0.05) * 100) / 100;
        const maxPrice = Math.round(modalPrice * (1.1 + Math.random() * 0.1) * 100) / 100;
        const arrivalQuantity = Math.round(50 + Math.random() * 500);

        await prisma.marketPrice.create({
          data: {
            cropName,
            variety: info.variety,
            district,
            state: 'Maharashtra',
            minPrice,
            maxPrice,
            modalPrice,
            arrivalQuantity,
            date,
          },
        });
      }
    }
  }

  // ─── QUALITY CERTIFICATES ──────────────────────────────────────────
  console.log('📜 Adding quality certificates...');
  
  // Lab test certificate for Cotton (crop[3] - not aggregated)
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[3].id,
      uploadedBy: farmers[1].user.id,
      certificateType: 'LAB_TEST',
      certificateNumber: 'LAB/2024/COT/001',
      issuerName: 'Maharashtra Agri Testing Lab, Nanded',
      issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://res.cloudinary.com/demo/sample-cert-cotton.pdf',
      verifiedByFPO: true,
      verifiedBy: fpoAdmin.id,
      verifiedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      aiScore: 85.3,
      notes: 'AI analysis: Fiber length good, Color grade B+',
    },
  });

  // FPO verified certificate for Cotton (crop[5] - not aggregated)
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[5].id,
      uploadedBy: fpoAdmin.id,
      certificateType: 'FPO_VERIFIED',
      certificateNumber: 'MKS/2024/COT/002',
      issuerName: 'Marathwada Kisan Sangha',
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://res.cloudinary.com/demo/sample-cert-cotton2.pdf',
      verifiedByFPO: true,
      verifiedBy: fpoAdmin.id,
      verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      aiScore: 88.0,
      notes: 'Grade A quality, Fiber content excellent',
    },
  });

  // Organic certificate for Tomato (crop[7] - not aggregated)
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[7].id,
      uploadedBy: farmers[3].user.id,
      certificateType: 'ORGANIC',
      certificateNumber: 'ORG/MH/2024/TOM/003',
      issuerName: 'India Organic Certification Agency',
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://res.cloudinary.com/demo/sample-cert-organic-tomato.pdf',
      verifiedByFPO: true,
      verifiedBy: fpoAdmin.id,
      verifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      notes: 'Certified organic farming, No chemical fertilizers',
    },
  });

  // Government certificate for Rice (crop[8] - not aggregated)
  await prisma.qualityCertificate.create({
    data: {
      cropId: crops[8].id,
      uploadedBy: farmers[4].user.id,
      certificateType: 'GOVERNMENT',
      certificateNumber: 'FSSAI/MH/2024/RIC/004',
      issuerName: 'FSSAI Maharashtra',
      issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://res.cloudinary.com/demo/sample-cert-fssai-rice.pdf',
      verifiedByFPO: false,
      notes: 'FSSAI approved, Food safety compliant',
    },
  });

  // Certificate for aggregated Wheat lot
  await prisma.qualityCertificate.create({
    data: {
      lotId: wheatLot.id,
      uploadedBy: fpoAdmin.id,
      certificateType: 'LAB_TEST',
      certificateNumber: 'LAB/2024/WHT-LOT/006',
      issuerName: 'Maharashtra Agri Testing Lab, Nanded',
      issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000),
      fileUrl: 'https://res.cloudinary.com/demo/sample-cert-wheat-lot.pdf',
      verifiedByFPO: true,
      verifiedBy: fpoAdmin.id,
      verifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      aiScore: 91.0,
      notes: 'Aggregated lot from 2 farms, Uniform quality Grade A',
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

  // ─── FPO LINK REQUESTS ─────────────────────────────────────────────
  console.log('🔗 Creating FPO link requests...');
  
  // Create 2 additional farmers who want to join FPO (not yet linked)
  const newFarmerData = [
    { name: 'Ramesh Kale', phone: '9876543216', email: 'ramesh@test.com', district: 'Nanded', aadhaar: '2345 6789 0123' },
    { name: 'Santosh Pawar', phone: '9876543217', email: 'santosh@test.com', district: 'Latur', aadhaar: '3456 7890 1234' },
  ];

  const newFarmers = [];
  for (const f of newFarmerData) {
    const user = await prisma.user.create({
      data: {
        name: f.name,
        phone: f.phone,
        email: f.email,
        passwordHash,
        role: 'FARMER',
        language: 'mr',
        kycVerified: true,
        aadhaar: f.aadhaar,
        bankAccount: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        ifsc: 'MAHB0000' + Math.floor(100 + Math.random() * 900),
        bankName: 'Maharashtra Gramin Bank',
        fpoLinkStatus: 'PENDING',
      },
    });
    newFarmers.push({ user, district: f.district });
    
    // Create farm for new farmer
    await prisma.farm.create({
      data: {
        farmerId: user.id,
        location: `${f.district} Taluka`,
        district: f.district,
        state: 'Maharashtra',
        areaAcres: 4.0 + Math.random() * 3,
        soilType: 'Black Cotton',
        irrigationType: 'Borewell',
        photos: [],
      },
    });
  }

  // Pending request from Ramesh Kale
  await prisma.fPOLinkRequest.create({
    data: {
      farmerId: newFarmers[0].user.id,
      fpoId: fpo.id,
      status: 'PENDING',
      farmerName: newFarmers[0].user.name,
      farmerPhone: newFarmers[0].user.phone,
      farmerDistrict: newFarmers[0].district,
      farmerAadhaar: newFarmers[0].user.aadhaar,
      message: 'मी तुमच्या FPO मध्ये सामील होऊ इच्छितो. माझ्याकडे 5 एकर शेती आहे.',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Approved request from Santosh Pawar (already processed)
  await prisma.fPOLinkRequest.create({
    data: {
      farmerId: newFarmers[1].user.id,
      fpoId: fpo.id,
      status: 'APPROVED',
      farmerName: newFarmers[1].user.name,
      farmerPhone: newFarmers[1].user.phone,
      farmerDistrict: newFarmers[1].district,
      farmerAadhaar: newFarmers[1].user.aadhaar,
      message: 'I want to join your FPO for better market access.',
      reviewedBy: fpoAdmin.id,
      reviewedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Update Santosh's user status to LINKED
  await prisma.user.update({
    where: { id: newFarmers[1].user.id },
    data: { 
      fpoLinkStatus: 'LINKED',
      linkedFpoId: fpo.id,
    },
  });

  // Create FPOFarmer record for Santosh (since approved)
  await prisma.fPOFarmer.create({
    data: {
      fpoId: fpo.id,
      name: newFarmers[1].user.name,
      phone: newFarmers[1].user.phone,
      aadhaar: newFarmers[1].user.aadhaar || '3456 7890 1234',
      bankAccount: newFarmers[1].user.bankAccount,
      ifsc: newFarmers[1].user.ifsc,
      district: newFarmers[1].district,
      photos: [],
    },
  });

  // Update existing farmers to have LINKED status
  for (const f of farmers) {
    await prisma.user.update({
      where: { id: f.user.id },
      data: {
        fpoLinkStatus: 'LINKED',
        linkedFpoId: fpo.id,
      },
    });
  }

  // ─── LOGISTICS ─────────────────────────────────────────────────────
  console.log('🚚 Seeding logistics tracking...');

  // Logistics for completed order
  const completedLogistics = await prisma.fPOLogistics.create({
    data: {
      orderId: completedOrder.id,
      fpoId: fpo.id,
      carrier: 'Marathwada Transport Co.',
      trackingNumber: 'TRK-998877',
      status: 'DELIVERED',
      
      // Driver & Vehicle Info
      driverName: 'Ramesh Kumar',
      driverPhone: '9876543230',
      vehicleNumber: 'MH-31-AB-1234',
      
      // Location Coordinates
      pickupLocation: 'Nanded FPO Center, Maharashtra',
      pickupLat: 19.1383,
      pickupLng: 77.3210,
      dropLocation: 'Agarwal Agro Industries, MIDC Waluj, Aurangabad',
      dropLat: 19.8597,
      dropLng: 75.3433,
      currentLat: 19.8597,
      currentLng: 75.3433,
      
      // Timestamps for each status
      assignedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      pickedUpAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      inTransitAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      outForDeliveryAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 4 * 3600000),
      estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      
      notes: 'Wheat delivery - 1300kg in 26 bags',
      deliveryProof: [
        'https://res.cloudinary.com/demo/delivery-proof-1.jpg',
        'https://res.cloudinary.com/demo/delivery-proof-2.jpg',
      ],
      deliveryNotes: 'All bags received in excellent condition. Quality verified.',
      
      events: {
        createMany: {
          data: [
            { status: 'REQUESTED', description: 'Pickup requested by farmer', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { status: 'ASSIGNED', description: 'Driver assigned - Ramesh Kumar', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
            { status: 'PICKED_UP', description: 'Picked up from FPO center', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { status: 'IN_TRANSIT', description: 'Vehicle reached Ahmednagar hub', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { status: 'OUT_FOR_DELIVERY', description: 'Out for delivery in Waluj area', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 4 * 3600000) },
            { status: 'DELIVERED', description: 'Delivered at Agarwal Agro Industries', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          ]
        }
      }
    }
  });

  // Logistics for pending order (in transit)
  const pendingLogistics = await prisma.fPOLogistics.create({
    data: {
      orderId: pendingOrder.id,
      fpoId: fpo.id,
      carrier: 'RapidAgri Logistics',
      trackingNumber: 'TRK-112233',
      status: 'IN_TRANSIT',
      
      // Driver & Vehicle Info
      driverName: 'Suresh Patil',
      driverPhone: '9876543231',
      vehicleNumber: 'MH-12-CD-5678',
      
      // Location Coordinates
      pickupLocation: 'Latur FPO Warehouse, Maharashtra',
      pickupLat: 18.4088,
      pickupLng: 76.5604,
      dropLocation: 'NutriGrain Processing Plant, Satara Road, Pune',
      dropLat: 18.5204,
      dropLng: 73.8567,
      currentLat: 18.1167, // Indapur Hub
      currentLng: 75.0167,
      
      // Timestamps for each status
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      pickedUpAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      inTransitAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      
      notes: 'Soybean delivery - 900kg in 18 bags',
      
      events: {
        createMany: {
          data: [
            { status: 'REQUESTED', description: 'Pickup requested for soybean order', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { status: 'ASSIGNED', description: 'Driver assigned - Suresh Patil', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { status: 'PICKED_UP', description: 'Picked up from aggregation center', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { status: 'IN_TRANSIT', description: 'Vehicle moving towards Pune via Indapur', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
          ]
        }
      }
    }
  });

  // Create a third order with REQUESTED status (no driver assigned yet)
  const requestedOrder = await prisma.order.create({
    data: {
      buyerId: buyers[0].id,
      cropId: crops[6].id, // Onion crop
      quantity: 500,
      totalAmount: 500 * 18,
      status: 'CONFIRMED',
      escrowStatus: 'HELD',
      deliveryAddress: 'Agarwal Agro Industries, MIDC Waluj, Aurangabad 431136',
    },
  });

  await prisma.escrowTransaction.create({
    data: {
      orderId: requestedOrder.id,
      buyerId: buyers[0].id,
      sellerId: fpoAdmin.id,
      amount: requestedOrder.totalAmount,
      status: 'HELD',
      heldAt: new Date(),
    },
  });

  // Logistics for requested order (waiting for driver assignment)
  const requestedLogistics = await prisma.fPOLogistics.create({
    data: {
      orderId: requestedOrder.id,
      fpoId: fpo.id,
      status: 'REQUESTED',
      
      // Location Coordinates
      pickupLocation: 'Pune Farm, Junnar Taluka',
      pickupLat: 19.2403,
      pickupLng: 73.8398,
      dropLocation: 'Agarwal Agro Industries, MIDC Waluj, Aurangabad',
      dropLat: 19.8597,
      dropLng: 75.3433,
      
      notes: 'Onion delivery - 500kg Nasik Red variety',
      
      events: {
        createMany: {
          data: [
            { status: 'REQUESTED', description: 'Pickup requested by farmer for onion delivery', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          ]
        }
      }
    }
  });

  // ─── ORDER TRACKING EVENTS ─────────────────────────────────────────
  console.log('📍 Adding order tracking events...');

  // Tracking events for completed order
  await prisma.orderTrackingEvent.createMany({
    data: [
      {
        orderId: completedOrder.id,
        status: 'PLACED',
        location: 'Nanded, Maharashtra',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Order placed by buyer',
        updatedBy: buyers[0].id,
        updatedByRole: Role.BUYER,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: completedOrder.id,
        status: 'CONFIRMED',
        location: 'Marathwada Kisan Sangha, Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Order confirmed by FPO',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: completedOrder.id,
        status: 'PACKED',
        location: 'FPO Aggregation Center, Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Wheat packed and ready for dispatch - 1300kg in 26 bags',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        photos: ['https://res.cloudinary.com/demo/packed-wheat-1.jpg'],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: completedOrder.id,
        status: 'PICKED_UP',
        location: 'Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Picked up by Marathwada Transport Co. - Truck MH-31-AB-1234',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        photos: ['https://res.cloudinary.com/demo/truck-loading.jpg'],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 3600000),
      },
      {
        orderId: completedOrder.id,
        status: 'IN_TRANSIT',
        location: 'Ahmednagar Hub',
        latitude: 19.0948,
        longitude: 74.7480,
        description: 'Vehicle reached Ahmednagar transit hub',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: completedOrder.id,
        status: 'IN_TRANSIT',
        location: 'Aurangabad Entry',
        latitude: 19.8762,
        longitude: 75.3433,
        description: 'Entered Aurangabad city limits',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 6 * 3600000),
      },
      {
        orderId: completedOrder.id,
        status: 'OUT_FOR_DELIVERY',
        location: 'MIDC Waluj, Aurangabad',
        latitude: 19.8597,
        longitude: 75.3433,
        description: 'Out for delivery to Agarwal Agro Industries',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 4 * 3600000),
      },
      {
        orderId: completedOrder.id,
        status: 'DELIVERED',
        location: 'Agarwal Agro Industries, MIDC Waluj, Aurangabad',
        latitude: 19.8597,
        longitude: 75.3433,
        description: 'Delivered successfully - All 26 bags received in good condition',
        updatedBy: buyers[0].id,
        updatedByRole: Role.BUYER,
        photos: [
          'https://res.cloudinary.com/demo/delivery-proof-1.jpg',
          'https://res.cloudinary.com/demo/delivery-proof-2.jpg',
        ],
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Update completed order with tracking details
  await prisma.order.update({
    where: { id: completedOrder.id },
    data: {
      trackingNumber: 'TRK-998877',
      estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveryProof: [
        'https://res.cloudinary.com/demo/delivery-proof-1.jpg',
        'https://res.cloudinary.com/demo/delivery-proof-2.jpg',
      ],
      deliveryNotes: 'All bags received in excellent condition. Quality verified.',
      confirmedByBuyer: true,
      confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Tracking events for pending order (in transit)
  await prisma.orderTrackingEvent.createMany({
    data: [
      {
        orderId: pendingOrder.id,
        status: 'PLACED',
        location: 'Pune, Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
        description: 'Order placed by NutriGrain Pvt Ltd',
        updatedBy: buyers[1].id,
        updatedByRole: Role.BUYER,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: pendingOrder.id,
        status: 'CONFIRMED',
        location: 'Marathwada Kisan Sangha, Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Order confirmed - Soybean lot ready',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 3600000),
      },
      {
        orderId: pendingOrder.id,
        status: 'PACKED',
        location: 'FPO Aggregation Center, Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Soybean packed - 900kg in 18 bags, Grade A quality',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        photos: ['https://res.cloudinary.com/demo/packed-soybean.jpg'],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 6 * 3600000),
      },
      {
        orderId: pendingOrder.id,
        status: 'PICKED_UP',
        location: 'Nanded',
        latitude: 19.1383,
        longitude: 77.3210,
        description: 'Picked up by RapidAgri Logistics - Truck MH-12-CD-5678',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: pendingOrder.id,
        status: 'IN_TRANSIT',
        location: 'Indapur Hub, Pune Highway',
        latitude: 18.1167,
        longitude: 75.0167,
        description: 'Vehicle at Indapur transit point - Expected to reach Pune tomorrow',
        updatedBy: fpoAdmin.id,
        updatedByRole: Role.FPO,
        timestamp: new Date(Date.now() - 3 * 3600000),
      },
    ],
  });

  // Update pending order with tracking details
  await prisma.order.update({
    where: { id: pendingOrder.id },
    data: {
      trackingNumber: 'TRK-112233',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('\n✅ Seeding complete!\n');
  console.log('═══════════════════════════════════════════');
  console.log('  📋 Login Credentials (all password: Test@1234)');
  console.log('═══════════════════════════════════════════');
  console.log('  FPO Admin:  fpo@test.com    / 9876543210');
  console.log('  Farmer 1:   farmer@test.com / 9876543211');
  console.log('  Buyer 1:    buyer@test.com  / 9876543220');
  console.log('═══════════════════════════════════════════');
  console.log(`  Users: 8 | Farms: 5 | FPO: 1 | Crops: 10`);
  console.log(`  Lots: 3 | Orders: 3 | Market Prices: ${180 * 6 * 4}`);
  console.log(`  Logistics: 3 (1 DELIVERED, 1 IN_TRANSIT, 1 REQUESTED)`);
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
