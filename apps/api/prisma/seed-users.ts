import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo users...');

  // Hash passwords
  const farmerPassword = await bcrypt.hash('Farmer123', 12);
  const buyerPassword = await bcrypt.hash('Buyer123', 12);
  const fpoPassword = await bcrypt.hash('Fpo123456', 12);

  // Create Farmer
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@test.com' },
    update: {
      password: farmerPassword,
    },
    create: {
      email: 'farmer@test.com',
      password: farmerPassword,
      name: 'Test Farmer',
      role: 'FARMER',
      phone: '+91-9876543210',
      district: 'Pune',
      state: 'Maharashtra',
      kycStatus: 'VERIFIED',
      isActive: true,
    },
  });

  console.log('✅ Created farmer:', farmer.email);

  // Create Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {
      password: buyerPassword,
    },
    create: {
      email: 'buyer@test.com',
      password: buyerPassword,
      name: 'Test Buyer',
      role: 'BUYER',
      phone: '+91-9876543211',
      district: 'Mumbai',
      state: 'Maharashtra',
      kycStatus: 'VERIFIED',
      isActive: true,
    },
  });

  console.log('✅ Created buyer:', buyer.email);

  // Create FPO
  const fpo = await prisma.user.upsert({
    where: { email: 'fpo@test.com' },
    update: {
      password: fpoPassword,
    },
    create: {
      email: 'fpo@test.com',
      password: fpoPassword,
      name: 'Test FPO',
      role: 'FPO',
      phone: '+91-9876543212',
      district: 'Nashik',
      state: 'Maharashtra',
      kycStatus: 'VERIFIED',
      isActive: true,
    },
  });

  console.log('✅ Created FPO:', fpo.email);

  console.log('\n✅ Demo users created successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('   Farmer: farmer@test.com / Farmer123');
  console.log('   Buyer:  buyer@test.com / Buyer123');
  console.log('   FPO:    fpo@test.com / Fpo123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
