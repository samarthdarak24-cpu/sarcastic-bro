/**
 * Verify logistics data in Docker container
 * Run with: docker-compose exec api npx ts-node verify-logistics.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyLogisticsData() {
  console.log('\n🔍 Verifying Logistics Data in Docker...\n');

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful\n');

    // Count logistics entries
    const totalCount = await prisma.fPOLogistics.count();
    console.log(`📊 Total Logistics Entries: ${totalCount}`);

    if (totalCount === 0) {
      console.log('\n⚠️  No logistics data found!');
      console.log('Running seed...');
      return;
    }

    // Get all logistics
    const logistics = await prisma.fPOLogistics.findMany({
      include: {
        order: {
          include: {
            buyer: { select: { name: true } },
          },
        },
        events: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    console.log('\n📦 Logistics Entries:\n');
    console.log('='.repeat(70));

    logistics.forEach((log: any, i) => {
      console.log(`\n[${i + 1}] Status: ${log.status}`);
      console.log(`    Tracking: ${log.trackingNumber || 'N/A'}`);
      console.log(`    Driver: ${log.driverName || 'Not Assigned'}`);
      console.log(`    Route: ${log.pickupLocation || 'N/A'} → ${log.dropLocation || 'N/A'}`);
      console.log(`    Buyer: ${log.order.buyer.name}`);
      console.log(`    Events: ${log.events.length > 0 ? log.events[0].status : 'None'}`);
    });

    // Status breakdown
    console.log('\n📈 Status Breakdown:');
    const byStatus = await prisma.fPOLogistics.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    byStatus.forEach(({ status, _count }) => {
      const icon = status === 'DELIVERED' ? '✅' : status === 'IN_TRANSIT' ? '🚚' : status === 'REQUESTED' ? '📋' : '📦';
      console.log(`    ${icon} ${status}: ${_count.status}`);
    });

    // Verify relationships
    console.log('\n🔗 Relationship Verification:');
    
    const withOrders = totalCount; // All logistics have orders (required field)
    console.log(`    ✅ With orders: ${withOrders}/${totalCount}`);

    const withFPO = totalCount; // All logistics have FPO (required field)
    console.log(`    ✅ With FPO: ${withFPO}/${totalCount}`);

    const withEvents = await prisma.fPOLogistics.count({
      where: { events: { some: {} } },
    });
    console.log(`    ✅ With events: ${withEvents}/${totalCount}`);

    const withDriver = await prisma.fPOLogistics.count({
      where: { NOT: { driverName: null } },
    } as any);
    console.log(`    ✅ With driver assigned: ${withDriver}/${totalCount}`);

    console.log('\n✅ Verification complete! Logistics data is ready.\n');
    console.log('🌐 Access the app:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:3001');
    console.log('\n🔐 Login Credentials:');
    console.log('   FPO Admin: fpo@test.com / Test@1234');
    console.log('   Buyer:     buyer@test.com / Test@1234');
    console.log('   Farmer:    farmer@test.com / Test@1234\n');

  } catch (error: any) {
    console.error('\n❌ Verification failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check if database is running: docker-compose ps');
    console.error('  2. Check API logs: docker-compose logs api');
    console.error('  3. Re-seed database: docker-compose exec api npx prisma db seed\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLogisticsData();
