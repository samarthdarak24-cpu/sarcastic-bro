import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addChatDemoData() {
  try {
    console.log('🌱 Adding chat demo data...\n');

    // Get or create test users
    let farmer = await prisma.user.findUnique({
      where: { email: 'farmer@test.com' },
    });

    if (!farmer) {
      const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash('Farmer123', 10));
      farmer = await prisma.user.create({
        data: {
          name: 'Rajesh Kumar',
          email: 'farmer@test.com',
          password: hashedPassword,
          phone: '9876543210',
          role: 'FARMER',
          district: 'Nashik',
          state: 'Maharashtra',
          address: 'Farm 42, Village Sinnar, Nashik',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
          kycStatus: 'VERIFIED',
          ratingAvg: 4.8,
        },
      });
    }

    let buyer = await prisma.user.findUnique({
      where: { email: 'buyer@test.com' },
    });

    if (!buyer) {
      const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash('Buyer123', 10));
      buyer = await prisma.user.create({
        data: {
          name: 'Priya Sharma',
          email: 'buyer@test.com',
          password: hashedPassword,
          phone: '9123456789',
          role: 'BUYER',
          district: 'Mumbai',
          state: 'Maharashtra',
          address: 'Agro Mart, Wholesale Market, Mumbai',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
          kycStatus: 'VERIFIED',
          ratingAvg: 4.6,
        },
      });
    }

    console.log('✅ Users ready (or already exist)');

    // Create product
    const product = await prisma.product.upsert({
      where: { id: 'product-demo-tomatoes' },
      update: {},
      create: {
        id: 'product-demo-tomatoes',
        name: 'Fresh Tomatoes - Grade A',
        description: 'Premium quality fresh tomatoes, Grade A, moisture 12%',
        category: 'Vegetables',
        price: 150,
        unit: 'kg',
        district: 'Nashik',
        state: 'Maharashtra',
        address: 'Farm 42, Village Sinnar',
        qualityGrade: 'A',
        imageUrls: 'https://images.unsplash.com/photo-1592075162160-ab4b9ee9c528?w=300',
        isActive: true,
        farmerId: farmer.id,
      },
    });

    console.log('✅ Product ready (or already exists)');

    // Create order
    const order = await prisma.order.upsert({
      where: { orderNumber: 'DEMO-2026-CHAT-001' },
      update: {},
      create: {
        orderNumber: 'DEMO-2026-CHAT-001',
        buyerId: buyer.id,
        farmerId: farmer.id,
        productId: product.id,
        quantity: 50,
        totalPrice: 7500,
        status: 'CONFIRMED',
        paymentStatus: 'PENDING',
        shippingAddress: 'Agro Mart, Wholesale Market, Mumbai',
        notes: 'Demo order for chat feature testing',
        confirmedAt: new Date(),
      },
    });

    console.log('✅ Order ready (or already exists)');

    // Create or get chat room
    let chatRoom = await prisma.chatRoom.findUnique({
      where: { orderId: order.id },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          orderId: order.id,
          farmerId: farmer.id,
          buyerId: buyer.id,
          productName: product.name,
          orderAmount: order.totalPrice,
          status: 'ACTIVE',
        },
      });
    }

    console.log('✅ Chat room ready');

    // Add sample messages if none exist
    const existingMessages = await prisma.chatRoomMessage.count({
      where: { chatRoomId: chatRoom.id },
    });

    if (existingMessages === 0) {
      await Promise.all([
        prisma.chatRoomMessage.create({
          data: {
            chatRoomId: chatRoom.id,
            senderId: buyer.id,
            content: 'Hi Rajesh, what is your best price for 50kg of tomatoes?',
            type: 'text',
            status: 'SEEN',
            sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
            seenAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
          },
        }),
        prisma.chatRoomMessage.create({
          data: {
            chatRoomId: chatRoom.id,
            senderId: farmer.id,
            content: 'Hello Priya! I can offer ₹150 per kg - fresh harvest from today!',
            type: 'text',
            status: 'SEEN',
            sentAt: new Date(Date.now() - 1.7 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 1.6 * 60 * 60 * 1000),
            seenAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          },
        }),
        prisma.chatRoomMessage.create({
          data: {
            chatRoomId: chatRoom.id,
            senderId: buyer.id,
            content: 'Can you do ₹140/kg for bulk? That\'s competitive.',
            type: 'text',
            status: 'SEEN',
            sentAt: new Date(Date.now() - 1.3 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
            seenAt: new Date(Date.now() - 1.1 * 60 * 60 * 1000),
          },
        }),
        prisma.chatRoomMessage.create({
          data: {
            chatRoomId: chatRoom.id,
            senderId: farmer.id,
            content: '✅ Agreed! ₹140/kg. I need 50% upfront, 50% on delivery. Ready to pickup tomorrow 7 AM?',
            type: 'text',
            status: 'DELIVERED',
            sentAt: new Date(Date.now() - 30 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 25 * 60 * 1000),
          },
        }),
      ]);
    }

    console.log('✅ Sample messages ready');

    // Update chat room with latest message
    await prisma.chatRoom.update({
      where: { id: chatRoom.id },
      data: {
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
        lastMessageBy: farmer.id,
      },
    });

    console.log('\n✨ Chat demo data ready!\n');
    console.log('📊 Summary:');
    console.log(`  Farmer: ${farmer.name} (${farmer.email})`);
    console.log(`  Buyer: ${buyer.name} (${buyer.email})`);
    console.log(`  Order: ${order.orderNumber}`);
    console.log(`  Chat Room: ${chatRoom.id}`);
    console.log('\n🔐 Credentials:');
    console.log('  farmer@test.com');
    console.log('  buyer@test.com');
    console.log('\n✨ Now refresh browser and login to see the features!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addChatDemoData();
