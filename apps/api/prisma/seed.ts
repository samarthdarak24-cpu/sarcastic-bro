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

  // 3. Clear old demo products from this farmer to avoid endless duplication
  await prisma.product.deleteMany({ where: { farmerId: demoFarmer.id }});

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
              status: "SHIPPED",
              buyerId: demoBuyer.id,
              farmerId: demoFarmer.id,
              productId: fetchedProducts[0].id,
              notes: "Express cold-chain logistics applied.",
              address: "Port of Mumbai Delivery"
          }
      });

      // Pending Order
      await prisma.order.create({
          data: {
              orderNumber: "ORD-99815-YY",
              totalPrice: fetchedProducts[1].price * 50,
              status: "PENDING",
              buyerId: demoBuyer.id,
              farmerId: demoFarmer.id,
              productId: fetchedProducts[1].id,
              notes: "Awaiting blockchain smart contract escrow release.",
              address: "Air Cargo Terminal 2"
          }
      });
  }

  console.log("✨ Seed complete! Premium Hackathon dummy data injected.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
