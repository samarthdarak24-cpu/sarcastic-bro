import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting premium demo data seed...");

  // Hash passwords
  const hashedPass = await bcrypt.hash("password123", 10);
  const farmerPass = await bcrypt.hash("Farmer123", 10);
  const buyerPass = await bcrypt.hash("Buyer123", 10);
  
  // Create test users for login demo
  const testFarmer = await prisma.user.upsert({
    where: { email: "farmer@test.com" },
    update: {},
    create: {
      email: "farmer@test.com",
      password: farmerPass,
      name: "Rajesh Kumar",
      role: "FARMER",
      district: "Nashik",
      state: "Maharashtra",
      phone: "9876543210",
      kycStatus: "VERIFIED",
      reputationScore: 95.5
    }
  });

  const testBuyer = await prisma.user.upsert({
    where: { email: "buyer@test.com" },
    update: {},
    create: {
      email: "buyer@test.com",
      password: buyerPass,
      name: "Priya Sharma",
      role: "BUYER",
      district: "Mumbai",
      state: "Maharashtra",
      phone: "9123456789",
      kycStatus: "VERIFIED",
      reputationScore: 97.2
    }
  });
  
  // 1. Create Premium Demo Farmer
  const demoFarmer = await prisma.user.upsert({
    where: { email: "demo.farmer@odop.com" },
    update: {},
    create: {
      email: "demo.farmer@odop.com",
      password: hashedPass,
      name: "Rajesh Kumar (Verified)",
      role: "FARMER",
      address: "Nashik, Maharashtra",
      phone: "9876543210",
      reputationScore: 98.4
    }
  });

  // 2. Create Premium Demo Buyer
  const demoBuyer = await prisma.user.upsert({
    where: { email: "demo.buyer@odop.com" },
    update: {},
    create: {
      email: "demo.buyer@odop.com",
      password: hashedPass,
      name: "LuxAgri Global Ltd",
      role: "BUYER",
      address: "Mumbai, Maharashtra",
      phone: "9876543211",
      reputationScore: 99.2
    }
  });

  // 3. Clear old demo products and related data from this farmer to avoid endless duplication
  // Delete in order of dependencies
  await prisma.orderTracking.deleteMany({ where: { orderId: { in: (await prisma.order.findMany({ where: { farmerId: demoFarmer.id } })).map(o => o.id) } } });
  await prisma.escrowOrder.deleteMany({ where: { farmerId: demoFarmer.id } });
  await prisma.order.deleteMany({ where: { farmerId: demoFarmer.id }});

  // 4. Inject High-Fidelity Products (With beautiful Unsplash images)
  const productsData = [
    {
      name: "Organic Tomatoes Elite (Grade A)",
      category: "Vegetables",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"]),
      price: 45,
      quantity: 500,
      unit: "kg",
      description: "Freshly harvested organic tomatoes from Nashik. AI graded for 0% defects.",
      qualityGrade: "A",
      qualityScore: 96.5,
      isActive: true,
      district: "Nashik",
      state: "Maharashtra",
      farmerId: demoFarmer.id
    },
    {
      name: "Alphonso Mangoes Export Spec",
      category: "Fruits",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80"]),
      price: 850,
      quantity: 150,
      unit: "box",
      description: "Premium export-quality Alphonso Mangoes. Blockchain traced.",
      qualityGrade: "A+",
      qualityScore: 99.1,
      isActive: true,
      district: "Ratnagiri",
      state: "Maharashtra",
      farmerId: demoFarmer.id
    },
    {
      name: "Red Onions Bulk Premium",
      category: "Vegetables",
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?w=800&q=80"]),
      price: 25,
      quantity: 2500,
      unit: "kg",
      description: "High-grade dry red onions perfect for long-haul storage and international export.",
      qualityGrade: "B",
      qualityScore: 88.5,
      isActive: true,
      district: "Lasalgaon",
      state: "Maharashtra",
      farmerId: demoFarmer.id
    }
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  // 5. Create Realistic Orders
  await prisma.order.deleteMany({ where: { farmerId: demoFarmer.id }});
  
  const fetchedProducts = await prisma.product.findMany({ where: { farmerId: demoFarmer.id }});
  
  if (fetchedProducts.length >= 2) {
      // Shipped Order
      await prisma.order.create({
          data: {
              orderNumber: "ORD-99812-XX",
              totalPrice: fetchedProducts[0].price * 100,
              quantity: 100,
              status: "SHIPPED",
              buyerId: demoBuyer.id,
              farmerId: demoFarmer.id,
              productId: fetchedProducts[0].id,
              notes: "Express cold-chain logistics applied. Port of Mumbai Delivery"
          }
      });

      // Pending Order
      await prisma.order.create({
          data: {
              orderNumber: "ORD-99815-YY",
              totalPrice: fetchedProducts[1].price * 50,
              quantity: 50,
              status: "PENDING",
              buyerId: demoBuyer.id,
              farmerId: demoFarmer.id,
              productId: fetchedProducts[1].id,
              notes: "Awaiting blockchain smart contract escrow release. Air Cargo Terminal 2"
          }
      });
  }

  // ─── PHASE 2: BUYER DASHBOARD MODELS ───────────────────────────────────

  // 6. Create Supplier Profile
  const supplier = await prisma.supplier.upsert({
    where: { userId: demoFarmer.id },
    update: {},
    create: {
      userId: demoFarmer.id,
      businessName: "Nashik Premium Agro",
      description: "Premium organic produce supplier from Nashik region",
      certifications: JSON.stringify(["ORGANIC", "EXPORT_CERTIFIED", "ISO_9001"]),
      specialties: JSON.stringify(["Tomatoes", "Onions", "Mangoes"]),
      minOrderQty: 50,
      maxOrderQty: 5000,
      leadTime: 3,
      rating: 4.8,
      totalOrders: 45,
      responseTime: 2,
      verificationStatus: "VERIFIED",
      isActive: true
    }
  });

  // 7. Create Bulk Products
  const bulkProducts = [];
  for (let i = 0; i < 3; i++) {
    const bulkProduct = await prisma.bulkProduct.create({
      data: {
        supplierId: supplier.id,
        name: `Bulk Product ${i + 1}`,
        category: ["Vegetables", "Fruits", "Grains"][i],
        description: `High-quality bulk ${["Vegetables", "Fruits", "Grains"][i].toLowerCase()} for wholesale`,
        minQuantity: 100,
        maxQuantity: 5000,
        unit: "kg",
        pricePerUnit: [25, 850, 35][i],
        qualityGrade: ["A", "A+", "B"][i],
        certifications: JSON.stringify(["ORGANIC", "EXPORT"]),
        imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"]),
        district: "Nashik",
        state: "Maharashtra",
        isActive: true
      }
    });
    bulkProducts.push(bulkProduct);
  }

  // 8. Create Buyer Reputation
  const buyerReputation = await prisma.buyerReputation.upsert({
    where: { userId: demoBuyer.id },
    update: {},
    create: {
      userId: demoBuyer.id,
      score: 92.5,
      totalPurchases: 156,
      onTimePayments: 148,
      latePayments: 8,
      disputes: 0,
      averageOrderValue: 45000,
      trustScore: 4.7
    }
  });

  // 9. Create Reputation History
  for (let i = 0; i < 5; i++) {
    await prisma.reputationHistory.create({
      data: {
        reputationId: buyerReputation.id,
        action: ["PURCHASE", "PAYMENT", "REVIEW", "DISPUTE", "PURCHASE"][i],
        scoreBefore: 90 + i,
        scoreAfter: 91 + i,
        change: 1,
        reason: `Action: ${["PURCHASE", "PAYMENT", "REVIEW", "DISPUTE", "PURCHASE"][i]}`,
        metadata: JSON.stringify({ orderId: `ORD-${1000 + i}` })
      }
    });
  }

  // 10. Create Pre-Bookings
  for (let i = 0; i < 2; i++) {
    await prisma.preBooking.create({
      data: {
        buyerId: demoBuyer.id,
        bulkProductId: bulkProducts[i].id,
        quantity: 500 + i * 100,
        pricePerUnit: bulkProducts[i].pricePerUnit,
        totalPrice: (500 + i * 100) * bulkProducts[i].pricePerUnit,
        targetDate: new Date(Date.now() + (30 + i * 10) * 24 * 60 * 60 * 1000),
        status: i === 0 ? "CONFIRMED" : "PENDING",
        notes: `Pre-booking for ${bulkProducts[i].name}`,
        confirmedAt: i === 0 ? new Date() : null
      }
    });
  }

  // 11. Create Bids
  for (let i = 0; i < 3; i++) {
    await prisma.bid.create({
      data: {
        buyerId: demoBuyer.id,
        productId: fetchedProducts[i % fetchedProducts.length].id,
        quantity: 100 + i * 50,
        pricePerUnit: fetchedProducts[i % fetchedProducts.length].price * (0.9 - i * 0.05),
        totalPrice: (100 + i * 50) * fetchedProducts[i % fetchedProducts.length].price * (0.9 - i * 0.05),
        validUntil: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000),
        status: i === 0 ? "ACCEPTED" : i === 1 ? "COUNTER" : "PENDING",
        counterOfferPrice: i === 1 ? fetchedProducts[i % fetchedProducts.length].price * 0.85 : null,
        aiRecommendation: JSON.stringify({ confidence: 0.92, suggestion: "Good market price" }),
        notes: `Bid for ${fetchedProducts[i % fetchedProducts.length].name}`
      }
    });
  }

  // 12. Create Order Tracking
  const orders = await prisma.order.findMany({ where: { buyerId: demoBuyer.id } });
  for (const order of orders) {
    await prisma.orderTracking.create({
      data: {
        orderId: order.id,
        status: order.status,
        location: "Nashik, Maharashtra",
        lat: 19.9975,
        lng: 73.7898,
        notes: `Tracking for order ${order.orderNumber}`,
        estimatedTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        actualTime: order.status === "DELIVERED" ? new Date() : null
      }
    });
  }

  // 13. Create Bulk Trades
  for (let i = 0; i < 2; i++) {
    await prisma.bulkTrade.create({
      data: {
        buyerId: demoBuyer.id,
        bulkProductId: bulkProducts[i].id,
        quantity: 1000 + i * 500,
        pricePerUnit: bulkProducts[i].pricePerUnit * 0.95,
        totalPrice: (1000 + i * 500) * bulkProducts[i].pricePerUnit * 0.95,
        status: i === 0 ? "MATCHED" : "PENDING",
        matchedSuppliers: JSON.stringify([supplier.id]),
        deliveryDate: new Date(Date.now() + (15 + i * 10) * 24 * 60 * 60 * 1000),
        notes: `Bulk trade for ${bulkProducts[i].name}`
      }
    });
  }

  // 14. Create Blockchain Transactions
  for (let i = 0; i < 3; i++) {
    await prisma.blockchainTransaction.create({
      data: {
        userId: demoBuyer.id,
        txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        type: ["PAYMENT", "ESCROW", "RATING"][i],
        amount: 50000 + i * 10000,
        fromAddress: `0xBuyer${i}`,
        toAddress: `0xSupplier${i}`,
        status: i === 0 ? "CONFIRMED" : "PENDING",
        blockNumber: 15000000 + i,
        gasUsed: 21000 + i * 1000,
        metadata: JSON.stringify({ orderId: `ORD-${1000 + i}` })
      }
    });
  }

  // 15. Create Security Events
  for (let i = 0; i < 4; i++) {
    await prisma.securityEvent.create({
      data: {
        userId: demoBuyer.id,
        eventType: ["LOGIN", "LOGOUT", "PASSWORD_CHANGE", "SUSPICIOUS_ACTIVITY"][i],
        ipAddress: `192.168.1.${100 + i}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: ["Mumbai", "Delhi", "Mumbai", "Unknown"][i],
        riskLevel: i === 3 ? "HIGH" : "LOW",
        blocked: i === 3,
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });
  }

  // 16. Create Chat Messages
  const conversation = await prisma.chatConversation.create({
    data: {
      user1Id: demoBuyer.id,
      user2Id: demoFarmer.id
    }
  });

  for (let i = 0; i < 3; i++) {
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: i % 2 === 0 ? demoBuyer.id : demoFarmer.id,
        content: i % 2 === 0 
          ? `Can you provide bulk pricing for 1000kg of ${bulkProducts[0].name}?`
          : `Yes, we can offer special pricing for bulk orders. Let me send you a quote.`,
        type: "text",
        isRead: true
      }
    });
  }

  // 17. Create Behavior Events
  for (let i = 0; i < 5; i++) {
    await prisma.behaviorEvent.create({
      data: {
        userId: demoBuyer.id,
        action: ["VIEW", "SEARCH", "BUY", "BID", "VIEW"][i],
        category: ["PRODUCT", "PRODUCT", "CONTRACT", "PRODUCT", "LOGISTICS"][i],
        metadata: JSON.stringify({ 
          productId: fetchedProducts[i % fetchedProducts.length].id,
          timestamp: new Date().toISOString()
        })
      }
    });
  }

  // 18. Create Escrow Orders
  if (orders.length > 0) {
    for (let i = 0; i < Math.min(2, orders.length); i++) {
      await prisma.escrowOrder.create({
        data: {
          orderId: orders[i].id,
          buyerId: demoBuyer.id,
          farmerId: demoFarmer.id,
          amount: orders[i].totalPrice,
          status: i === 0 ? "RELEASED" : "HELD",
          escrowAddress: `0xEscrow${i}`,
          depositTxHash: `0xDeposit${i}`,
          releaseTxHash: i === 0 ? `0xRelease${i}` : null,
          buyerConfirmed: i === 0,
          farmerDelivered: i === 0,
          releasedAt: i === 0 ? new Date() : null
        }
      });
    }
  }

  console.log("✨ Seed complete! Premium Hackathon dummy data with Phase 2 models injected.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
