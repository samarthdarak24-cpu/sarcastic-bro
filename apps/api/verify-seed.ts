import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  try {
    const suppliers = await prisma.supplier.count();
    const bulkProducts = await prisma.bulkProduct.count();
    const buyerReputation = await prisma.buyerReputation.count();
    const preBookings = await prisma.preBooking.count();
    const bids = await prisma.bid.count();
    const orderTracking = await prisma.orderTracking.count();
    const bulkTrades = await prisma.bulkTrade.count();
    const blockchainTransactions = await prisma.blockchainTransaction.count();
    const securityEvents = await prisma.securityEvent.count();
    const chatMessages = await prisma.chatMessage.count();
    const behaviorEvents = await prisma.behaviorEvent.count();
    const escrowOrders = await prisma.escrowOrder.count();

    console.log('✅ Phase 2 Database Verification:');
    console.log(`  Suppliers: ${suppliers}`);
    console.log(`  Bulk Products: ${bulkProducts}`);
    console.log(`  Buyer Reputation: ${buyerReputation}`);
    console.log(`  Pre-Bookings: ${preBookings}`);
    console.log(`  Bids: ${bids}`);
    console.log(`  Order Tracking: ${orderTracking}`);
    console.log(`  Bulk Trades: ${bulkTrades}`);
    console.log(`  Blockchain Transactions: ${blockchainTransactions}`);
    console.log(`  Security Events: ${securityEvents}`);
    console.log(`  Chat Messages: ${chatMessages}`);
    console.log(`  Behavior Events: ${behaviorEvents}`);
    console.log(`  Escrow Orders: ${escrowOrders}`);
  } catch (error) {
    console.error('Error verifying seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
