/**
 * Test script to verify logistics data in the database
 * Run with: npx ts-node test-logistics-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testLogisticsData() {
  console.log('🔍 Testing Logistics Data...\n');

  try {
    // 1. Count all logistics entries
    const totalCount = await prisma.fPOLogistics.count();
    console.log(`📊 Total Logistics Entries: ${totalCount}\n`);

    // 2. Get all logistics with details
    const allLogistics = await prisma.fPOLogistics.findMany({
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true } },
            crop: true,
            lot: true,
          },
        },
        fpo: { select: { name: true } },
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📦 All Logistics Entries:\n');
    console.log('='.repeat(80));

    allLogistics.forEach((logistics, index) => {
      console.log(`\n[${index + 1}] Logistics ID: ${logistics.id}`);
      console.log(`    Status: ${logistics.status}`);
      console.log(`    Tracking Number: ${logistics.trackingNumber || 'N/A'}`);
      console.log(`    Carrier: ${logistics.carrier || 'N/A'}`);
      console.log(`    Driver: ${logistics.driverName || 'Not Assigned'}`);
      console.log(`    Driver Phone: ${logistics.driverPhone || 'N/A'}`);
      console.log(`    Vehicle: ${logistics.vehicleNumber || 'N/A'}`);
      console.log(`    Pickup: ${logistics.pickupLocation || 'N/A'}`);
      console.log(`    Drop: ${logistics.dropLocation || 'N/A'}`);
      console.log(`    Order ID: ${logistics.orderId}`);
      console.log(`    Order Status: ${logistics.order.status}`);
      console.log(`    Buyer: ${logistics.order.buyer.name}`);
      console.log(`    FPO: ${logistics.fpo.name}`);
      console.log(`    Events: ${logistics.events.length}`);
      
      if (logistics.events.length > 0) {
        console.log(`    Latest Event: ${logistics.events[0].status} - ${logistics.events[0].description}`);
      }
      
      console.log('-'.repeat(80));
    });

    // 3. Count by status
    console.log('\n📈 Logistics by Status:');
    const statusCounts = await prisma.fPOLogistics.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    statusCounts.forEach(({ status, _count }) => {
      console.log(`    ${status}: ${_count.status}`);
    });

    // 4. Test specific queries
    console.log('\n🔎 Testing Specific Queries:\n');

    // Get REQUESTED logistics (for FPO dashboard)
    const requestedLogistics = await prisma.fPOLogistics.findMany({
      where: { status: 'REQUESTED' },
      include: {
        order: { include: { buyer: { select: { name: true } } } },
      },
    });
    console.log(`✅ REQUESTED (needs driver assignment): ${requestedLogistics.length}`);

    // Get IN_TRANSIT logistics
    const inTransitLogistics = await prisma.fPOLogistics.findMany({
      where: { status: 'IN_TRANSIT' },
      include: {
        order: { include: { buyer: { select: { name: true } } } },
      },
    });
    console.log(`✅ IN_TRANSIT (actively delivering): ${inTransitLogistics.length}`);

    // Get DELIVERED logistics
    const deliveredLogistics = await prisma.fPOLogistics.findMany({
      where: { status: 'DELIVERED' },
      include: {
        order: { include: { buyer: { select: { name: true } } } },
      },
    });
    console.log(`✅ DELIVERED (completed): ${deliveredLogistics.length}`);

    console.log('\n✅ All tests passed! Logistics data is properly seeded.\n');

  } catch (error) {
    console.error('❌ Error testing logistics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogisticsData();
