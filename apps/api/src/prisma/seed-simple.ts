import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.qualityScan.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderTracking.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('Farmer123', 10);
  const hashedPasswordBuyer = await bcrypt.hash('Buyer123', 10);

  // Create Farmer
  console.log('👨‍🌾 Creating farmer...');
  const farmer = await prisma.user.create({
    data: {
      email: 'farmer@test.com',
      password: hashedPassword,
      name: 'Ramesh Kumar',
      role: 'FARMER',
      phone: '+91-9876543210',
      address: 'Village Khandala, Tehsil Maval',
      district: 'Pune',
      state: 'Maharashtra',
      language: 'MARATHI',
      kycStatus: 'VERIFIED',
      reputationScore: 4.5,
      isActive: true,
    },
  });

  // Create Buyer
  console.log('🛒 Creating buyer...');
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@test.com',
      password: hashedPasswordBuyer,
      name: 'Suresh Patil',
      role: 'BUYER',
      phone: '+91-9876543211',
      address: 'Shop 12, Market Yard',
      district: 'Mumbai',
      state: 'Maharashtra',
      language: 'MARATHI',
      kycStatus: 'VERIFIED',
      reputationScore: 4.3,
      isActive: true,
    },
  });

  // Create Products
  console.log('🌾 Creating products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Tomatoes',
        category: 'vegetable',
        description: 'Fresh organic tomatoes from my farm',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1546094096-0df4bcaaa337']),
        price: 40,
        quantity: 500,
        unit: 'kg',
        qualityGrade: 'A+',
        qualityScore: 95,
        district: 'Pune',
        state: 'Maharashtra',
        isActive: true,
        farmerId: farmer.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Onions',
        category: 'vegetable',
        description: 'Premium quality onions',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb']),
        price: 30,
        quantity: 1000,
        unit: 'kg',
        qualityGrade: 'A',
        qualityScore: 88,
        district: 'Pune',
        state: 'Maharashtra',
        isActive: true,
        farmerId: farmer.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Basmati Rice',
        category: 'grain',
        description: 'Premium basmati rice',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1586201375761-83865001e31c']),
        price: 80,
        quantity: 2000,
        unit: 'kg',
        qualityGrade: 'A+',
        qualityScore: 92,
        district: 'Pune',
        state: 'Maharashtra',
        isActive: true,
        farmerId: farmer.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Mangoes',
        category: 'fruit',
        description: 'Alphonso mangoes from Konkan',
        imageUrls: JSON.stringify(['https://images.unsplash.com/photo-1553279768-865429fa0078']),
        price: 120,
        quantity: 300,
        unit: 'kg',
        qualityGrade: 'A+',
        qualityScore: 98,
        district: 'Ratnagiri',
        state: 'Maharashtra',
        isActive: true,
        farmerId: farmer.id,
      },
    }),
  ]);

  // Create Conversation
  console.log('💬 Creating conversation...');
  const conversation = await prisma.conversation.create({
    data: {
      user1Id: farmer.id,
      user2Id: buyer.id,
      lastMessageAt: new Date(),
    },
  });

  // Create Messages
  console.log('📨 Creating messages...');
  await Promise.all([
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: buyer.id,
        receiverId: farmer.id,
        content: 'Hello! I am interested in your tomatoes. What is the minimum order quantity?',
        type: 'TEXT',
        isRead: true,
        readAt: new Date(),
      },
    }),
    prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: farmer.id,
        receiverId: buyer.id,
        content: 'Namaste! Minimum order is 50 kg. I can deliver within 2 days.',
        type: 'TEXT',
        isRead: false,
      },
    }),
  ]);

  // Create Orders
  console.log('📦 Creating orders...');
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-001',
      productId: products[0].id,
      farmerId: farmer.id,
      buyerId: buyer.id,
      quantity: 100,
      totalPrice: 4000,
      status: 'ACCEPTED',
      notes: 'Please deliver by tomorrow',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-002',
      productId: products[1].id,
      farmerId: farmer.id,
      buyerId: buyer.id,
      quantity: 200,
      totalPrice: 6000,
      status: 'IN_TRANSIT',
      notes: 'Urgent delivery needed',
    },
  });

  // Create Order Tracking
  console.log('🚚 Creating order tracking...');
  await Promise.all([
    prisma.orderTracking.create({
      data: {
        orderId: order1.id,
        status: 'ACCEPTED',
        location: 'Pune, Maharashtra',
        notes: 'Order accepted by farmer',
      },
    }),
    prisma.orderTracking.create({
      data: {
        orderId: order2.id,
        status: 'IN_TRANSIT',
        location: 'Mumbai Highway',
        lat: 19.0760,
        lng: 72.8777,
        notes: 'Out for delivery',
        estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Create Payment
  console.log('💳 Creating payments...');
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      userId: buyer.id,
      amount: 4000,
      currency: 'INR',
      status: 'PAID',
      paymentMethod: 'UPI',
    },
  });

  // Create Rating
  console.log('⭐ Creating ratings...');
  await prisma.rating.create({
    data: {
      orderId: order1.id,
      fromUserId: buyer.id,
      toUserId: farmer.id,
      stars: 5,
      review: 'Excellent quality tomatoes! Very fresh and well-packed.',
    },
  });

  // Create Quality Scan
  console.log('🔍 Creating quality scans...');
  await prisma.qualityScan.create({
    data: {
      productId: products[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
      grade: 'A+',
      score: 95,
      confidence: 98,
      defects: JSON.stringify([]),
    },
  });

  // Create Notifications
  console.log('🔔 Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: farmer.id,
        type: 'ORDER',
        title: 'New Order Received',
        message: 'You have received a new order for Organic Tomatoes',
        metadata: JSON.stringify({ orderId: order1.id }),
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: buyer.id,
        type: 'MESSAGE',
        title: 'New Message',
        message: 'Ramesh Kumar sent you a message',
        metadata: JSON.stringify({ conversationId: conversation.id }),
        isRead: false,
      },
    }),
  ]);

  // Create Favorite
  console.log('❤️ Creating favorites...');
  await prisma.favorite.create({
    data: {
      buyerId: buyer.id,
      farmerId: farmer.id,
      notes: 'Reliable farmer with good quality products',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 2 (1 farmer, 1 buyer)`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Orders: 2`);
  console.log(`   - Messages: 2`);
  console.log(`   - Ratings: 1`);
  console.log(`   - Notifications: 2`);
  console.log('\n🔐 Test Accounts:');
  console.log('   Farmer: farmer@test.com / Farmer123');
  console.log('   Buyer:  buyer@test.com / Buyer123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
