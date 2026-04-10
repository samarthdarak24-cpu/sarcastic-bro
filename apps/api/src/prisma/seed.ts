/* ========================================================================
   Seed Script — ODOP Connect
   Populates the database with realistic dummy data for:
   - 5 Farmers + 5 Buyers
   - 20+ Products with categories
   - Orders in multiple statuses
   - Messages (conversations)
   - Proposals (pending/accepted/rejected)
   - Reviews + Ratings
   - Tenders (active + closed)
   - Notifications
   - Contracts
   - Sample Requests
   - Logistics shipments
   ======================================================================== */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HASH_ROUNDS = 10;

// ─── Users ────────────────────────────────────────────────────────────

const farmers = [
  { name: "Ramesh Yadav", email: "ramesh@odop.in", phone: "+91-9876543210", district: "Varanasi", state: "Uttar Pradesh", avatarUrl: null },
  { name: "Lakshmi Devi", email: "lakshmi@odop.in", phone: "+91-9876543211", district: "Madurai", state: "Tamil Nadu", avatarUrl: null },
  { name: "Kamal Nath Verma", email: "kamal@odop.in", phone: "+91-9876543212", district: "Jaipur", state: "Rajasthan", avatarUrl: null },
  { name: "Savita Kumari", email: "savita@odop.in", phone: "+91-9876543213", district: "Kochi", state: "Kerala", avatarUrl: null },
  { name: "Bhushan Patil", email: "bhushan@odop.in", phone: "+91-9876543214", district: "Pune", state: "Maharashtra", avatarUrl: null },
];

const buyers = [
  { name: "Rajesh Kumar", email: "rajesh@buyer.in", phone: "+91-9012345670", district: "Delhi", state: "Delhi", avatarUrl: null },
  { name: "Priya Sharma", email: "priya@buyer.in", phone: "+91-9012345671", district: "Mumbai", state: "Maharashtra", avatarUrl: null },
  { name: "Mohamed Ali", email: "ali@buyer.in", phone: "+91-9012345672", district: "Chennai", state: "Tamil Nadu", avatarUrl: null },
  { name: "Sunil Patel", email: "sunil@buyer.in", phone: "+91-9012345673", district: "Ahmedabad", state: "Gujarat", avatarUrl: null },
  { name: "Ananya Das", email: "ananya@buyer.in", phone: "+91-9012345674", district: "Kolkata", state: "West Bengal", avatarUrl: null },
];

// ─── Products ─────────────────────────────────────────────────────────

const products = [
  { name: "Banarasi Silk Saree", category: "Textiles", price: 4500, unit: "piece", quantity: 50, description: "Handwoven Banarasi silk with zari work. Traditional motifs passed down through generations.", isODOP: true, qualityGrade: "A", qualityScore: 4.8 },
  { name: "Kanchipuram Silk", category: "Textiles", price: 6200, unit: "piece", quantity: 30, description: "Authentic Kanchipuram silk saree with temple border design. GI tagged product.", isODOP: true, qualityGrade: "A", qualityScore: 4.9 },
  { name: "Organic Turmeric (Lakadong)", category: "Spices", price: 280, unit: "kg", quantity: 2000, description: "High curcumin content (7-9%) organic turmeric from Meghalaya. Lab tested and certified.", isODOP: true, qualityGrade: "A", qualityScore: 4.7 },
  { name: "Kashmiri Saffron", category: "Spices", price: 95000, unit: "kg", quantity: 5, description: "GI tagged Kashmiri Mongra saffron. Grade I with deep red stigmas and intense aroma.", isODOP: true, qualityGrade: "A", qualityScore: 5.0 },
  { name: "Alphonso Mango", category: "Fruits", price: 800, unit: "dozen", quantity: 500, description: "Premium Ratnagiri Alphonso mangoes. Naturally ripened, no carbide. Export quality.", isODOP: true, qualityGrade: "A", qualityScore: 4.6 },
  { name: "Darjeeling First Flush Tea", category: "Tea", price: 1200, unit: "kg", quantity: 100, description: "Single estate first flush Darjeeling tea. Light muscatel flavor with floral notes.", isODOP: true, qualityGrade: "A", qualityScore: 4.8 },
  { name: "Coorg Arabica Coffee", category: "Coffee", price: 450, unit: "kg", quantity: 300, description: "Shade-grown Arabica coffee beans from Coorg plantations. Medium roast, chocolate notes.", isODOP: true, qualityGrade: "B", qualityScore: 4.3 },
  { name: "Basmati Rice (1121)", category: "Grains", price: 120, unit: "kg", quantity: 5000, description: "Extra-long grain 1121 Basmati rice. Aged 2 years for perfect elongation and aroma.", isODOP: false, qualityGrade: "A", qualityScore: 4.5 },
  { name: "Organic Wheat (Sharbati)", category: "Grains", price: 45, unit: "kg", quantity: 10000, description: "MP Sharbati wheat, organically grown. High protein content, golden grain.", isODOP: true, qualityGrade: "B", qualityScore: 4.2 },
  { name: "Jodhpuri Mojari", category: "Handicrafts", price: 850, unit: "pair", quantity: 200, description: "Handcrafted traditional Rajasthani mojari shoes with mirror work and embroidery.", isODOP: true, qualityGrade: "A", qualityScore: 4.4 },
  { name: "Blue Pottery Vase", category: "Handicrafts", price: 1200, unit: "piece", quantity: 75, description: "Jaipur blue pottery vase with traditional Persian-inspired floral patterns.", isODOP: true, qualityGrade: "A", qualityScore: 4.7 },
  { name: "Chanderi Fabric", category: "Textiles", price: 350, unit: "meter", quantity: 1000, description: "Lightweight Chanderi cotton-silk blend with traditional butti patterns from MP.", isODOP: true, qualityGrade: "B", qualityScore: 4.1 },
  { name: "Kerala Coconut Oil", category: "Oils", price: 220, unit: "liter", quantity: 800, description: "Cold-pressed virgin coconut oil from Kerala. No chemicals, traditional chekku method.", isODOP: true, qualityGrade: "A", qualityScore: 4.6 },
  { name: "Nagpur Orange", category: "Fruits", price: 80, unit: "kg", quantity: 3000, description: "Fresh Nagpur Santra oranges. Sweet and juicy with thin skin. Direct from orchards.", isODOP: true, qualityGrade: "B", qualityScore: 4.0 },
  { name: "Mysore Agarbatti", category: "Handicrafts", price: 150, unit: "packet", quantity: 500, description: "Hand-rolled Mysore sandalwood incense sticks. Natural ingredients, temple grade.", isODOP: true, qualityGrade: "A", qualityScore: 4.5 },
  { name: "Makhana (Fox Nuts)", category: "Snacks", price: 600, unit: "kg", quantity: 400, description: "Premium grade Mithila Makhana. Large pops, low fat, high protein superfood.", isODOP: true, qualityGrade: "A", qualityScore: 4.7 },
  { name: "Assam CTC Tea", category: "Tea", price: 350, unit: "kg", quantity: 1500, description: "Strong Assam CTC tea leaves from upper Assam gardens. Rich malty flavor.", isODOP: false, qualityGrade: "B", qualityScore: 4.0 },
  { name: "Kolhapuri Chappal", category: "Handicrafts", price: 950, unit: "pair", quantity: 150, description: "Genuine Kolhapuri leather chappals. Vegetable tanned, handstitched craftsmanship.", isODOP: true, qualityGrade: "A", qualityScore: 4.3 },
  { name: "Guduchi/Giloy Powder", category: "Herbs", price: 380, unit: "kg", quantity: 200, description: "Organic Guduchi stem powder from Madhya Pradesh. Ayurvedic immunity booster.", isODOP: false, qualityGrade: "B", qualityScore: 3.9 },
  { name: "Aranmula Kannadi (Mirror)", category: "Handicrafts", price: 3500, unit: "piece", quantity: 25, description: "Authentic Aranmula metal mirror from Kerala. UNESCO-recognized heritage craft.", isODOP: true, qualityGrade: "A", qualityScore: 4.9 },
  { name: "Manipuri Black Rice", category: "Grains", price: 180, unit: "kg", quantity: 600, description: "Chak-Hao black rice from Manipur. Rich in anthocyanins, natural antioxidant.", isODOP: true, qualityGrade: "A", qualityScore: 4.6 },
  { name: "Wayanad Pepper", category: "Spices", price: 750, unit: "kg", quantity: 350, description: "Premium Wayanad black pepper. Bold berries with intense pungency and aroma.", isODOP: true, qualityGrade: "A", qualityScore: 4.8 },
];

// ─── Helper ───────────────────────────────────────────────────────────

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

// ========================================================================
//  MAIN SEED FUNCTION
// ========================================================================

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // ─── Clean existing data ────────────────────────────────────────────
  console.log("🧹 Cleaning existing data...");
  // await prisma.logistics.deleteMany();
  // await prisma.sampleRequest.deleteMany();
  // await prisma.tenderApplication.deleteMany();
  // await prisma.tender.deleteMany();
  await prisma.notification.deleteMany();
  // await prisma.contract.deleteMany();
  await prisma.review.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.order.deleteMany();
  await prisma.message.deleteMany();
  await prisma.product.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Database cleaned\n");

  // ─── Create Users ──────────────────────────────────────────────────
  console.log("👤 Creating users...");
  const password = await bcrypt.hash("Test@1234", HASH_ROUNDS);
  const farmerTestPass = await bcrypt.hash("Farmer123", HASH_ROUNDS);
  const buyerTestPass = await bcrypt.hash("Buyer123", HASH_ROUNDS);

  // Create test users for login demo
  const testFarmer = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "farmer@test.com",
      phone: "9876543210",
      password: farmerTestPass,
      role: "FARMER",
      district: "Nashik",
      state: "Maharashtra",
      kycStatus: "VERIFIED",
      isActive: true,
    },
  });
  console.log(`  ✓ Test Farmer: ${testFarmer.name} (${testFarmer.email}) - Password: Farmer123`);

  const testBuyer = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "buyer@test.com",
      phone: "9123456789",
      password: buyerTestPass,
      role: "BUYER",
      district: "Mumbai",
      state: "Maharashtra",
      kycStatus: "VERIFIED",
      isActive: true,
    },
  });
  console.log(`  ✓ Test Buyer: ${testBuyer.name} (${testBuyer.email}) - Password: Buyer123`);

  const fpoTestPass = await bcrypt.hash("Fpo123", HASH_ROUNDS);
  const testFpo = await prisma.user.create({
    data: {
      name: "Green Earth FPO",
      email: "fpo@test.com",
      phone: "9988776655",
      password: fpoTestPass,
      role: "FPO",
      district: "Pune",
      state: "Maharashtra",
      kycStatus: "VERIFIED",
      isActive: true,
    },
  });
  console.log(`  ✓ Test FPO: ${testFpo.name} (${testFpo.email}) - Password: Fpo123`);

  const createdFarmers = [];
  for (const f of farmers) {
    const user = await prisma.user.create({
      data: {
        ...f,
        password,
        role: "FARMER",
        kycStatus: "VERIFIED",
        isActive: true,
      },
    });
    createdFarmers.push(user);
    console.log(`  ✓ Farmer: ${user.name} (${user.email})`);
  }

  const createdBuyers = [];
  for (const b of buyers) {
    const user = await prisma.user.create({
      data: {
        ...b,
        password,
        role: "BUYER",
        kycStatus: "VERIFIED",
        isActive: true,
      },
    });
    createdBuyers.push(user);
    console.log(`  ✓ Buyer: ${user.name} (${user.email})`);
  }
  console.log(`✓ Created ${createdFarmers.length} farmers + ${createdBuyers.length} buyers\n`);

  // ─── Create Products ───────────────────────────────────────────────
  console.log("📦 Creating products...");
  const createdProducts = [];
  for (let i = 0; i < products.length; i++) {
    const farmer = createdFarmers[i % createdFarmers.length];
    const p = products[i];
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        unit: p.unit,
        quantity: p.quantity,
        district: farmer.district!,
        state: farmer.state!,
        isODOP: p.isODOP,
        qualityGrade: p.qualityGrade,
        qualityScore: p.qualityScore,
        farmerId: farmer.id,
        isActive: true,
      },
    });
    createdProducts.push(product);
    console.log(`  ✓ ${product.name} — ₹${product.price}/${product.unit} (${farmer.name})`);
  }
  console.log(`✓ Created ${createdProducts.length} products\n`);

  // ─── Create Orders ─────────────────────────────────────────────────
  console.log("🛒 Creating orders...");
  const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const createdOrders = [];

  for (let i = 0; i < 15; i++) {
    const buyer = createdBuyers[i % createdBuyers.length];
    const product = createdProducts[i % createdProducts.length];
    const farmer = createdFarmers.find(f => f.id === product.farmerId)!;
    const qty = randomBetween(5, 100);
    const status = orderStatuses[i % orderStatuses.length];

    const order = await prisma.order.create({
      data: {
        buyerId: buyer.id,
        farmerId: farmer.id,
        productId: product.id,
        quantity: qty,
        totalPrice: qty * product.price,
        status,
        paymentMethod: randomElement(["UPI", "Bank Transfer", "Cash on Delivery"]),
        paymentStatus: status === "DELIVERED" ? "PAID" : status === "CANCELLED" ? "REFUNDED" : "PENDING",
        shippingAddress: `${buyer.district}, ${buyer.state} - 110001`,
        // trackingNumber: status === "SHIPPED" || status === "DELIVERED" ? `ODOP${100000 + i}` : null,
        notes: i % 3 === 0 ? "Please deliver before festival season" : null,
        createdAt: daysAgo(randomBetween(1, 60)),
      },
    });
    createdOrders.push(order);
    console.log(`  ✓ Order #${order.orderNumber.slice(0, 8)}... → ${status} (₹${order.totalPrice})`);
  }
  console.log(`✓ Created ${createdOrders.length} orders\n`);

  // ─── Create Messages ───────────────────────────────────────────────
  console.log("💬 Creating messages...");
  const conversations = [
    { farmer: 0, buyer: 0, msgs: [
      { from: "buyer", text: "Namaste! I'm interested in your Banarasi Silk Sarees. Can you share more details?" },
      { from: "farmer", text: "Namaste ji! Thank you for your interest. We have pure handwoven silk with real zari. Each saree takes 15-20 days to weave." },
      { from: "buyer", text: "Wonderful. What's the minimum order quantity? I need for my retail store in Delhi." },
      { from: "farmer", text: "MOQ is 10 pieces. For bulk orders above 50, I can offer 8% discount. We also provide certificate of authenticity." },
      { from: "buyer", text: "Perfect. I'll send a proposal for 25 pieces. Do you ship to Delhi directly?" },
      { from: "farmer", text: "Yes, we ship all over India. Delhi delivery takes 3-5 days via our trusted logistics partner." },
    ]},
    { farmer: 1, buyer: 2, msgs: [
      { from: "buyer", text: "Hi Lakshmi, I need bulk Kanchipuram silk for my export business. What's your capacity?" },
      { from: "farmer", text: "Hello! We can produce up to 50 sarees per month. Each one is handcrafted by our village women cooperative." },
      { from: "buyer", text: "Excellent craftsmanship. Can I get a sample first before bulk order?" },
      { from: "farmer", text: "Of course! I'll ship 2 samples. Takes 3 days to Chennai. No charges for first sample." },
    ]},
    { farmer: 2, buyer: 1, msgs: [
      { from: "buyer", text: "Kamal ji, your blue pottery is beautiful. Any wholesale pricing?" },
      { from: "farmer", text: "Thank you! For wholesale (50+ pieces), price drops to ₹900 per vase. Each is unique." },
      { from: "buyer", text: "Great. I'll place an order through the platform. Also interested in your Mojari collection." },
    ]},
    { farmer: 3, buyer: 3, msgs: [
      { from: "buyer", text: "Need 200 liters of your coconut oil. Is it truly cold-pressed?" },
      { from: "farmer", text: "100% cold-pressed using traditional chekku method. No heat, no chemicals. FSSAI certified." },
      { from: "buyer", text: "Can you send the FSSAI certificate? And what's the shelf life?" },
      { from: "farmer", text: "Certificate attached with every shipment. Shelf life is 18 months. Stored in food-grade tin containers." },
      { from: "buyer", text: "Excellent. Processing the order now. Thank you!" },
    ]},
    { farmer: 4, buyer: 4, msgs: [
      { from: "buyer", text: "Hello! I want Alphonso mangoes for my restaurant chain in Kolkata." },
      { from: "farmer", text: "You've come to the right place! Our Ratnagiri Alphonsos are premium grade. Season is March-June." },
      { from: "buyer", text: "How do you ensure quality during transit?" },
      { from: "farmer", text: "Temperature-controlled packaging with hay bedding. We guarantee zero damage or full replacement." },
    ]},
  ];

  let msgCount = 0;
  for (const conv of conversations) {
    const farmer = createdFarmers[conv.farmer];
    const buyer = createdBuyers[conv.buyer];
    for (let j = 0; j < conv.msgs.length; j++) {
      const m = conv.msgs[j];
      await prisma.message.create({
        data: {
          senderId: m.from === "farmer" ? farmer.id : buyer.id,
          receiverId: m.from === "farmer" ? buyer.id : farmer.id,
          content: m.text,
          type: "text",
          isRead: j < conv.msgs.length - 1,
          createdAt: daysAgo(conv.msgs.length - j),
        },
      });
      msgCount++;
    }
  }
  console.log(`✓ Created ${msgCount} messages across ${conversations.length} conversations\n`);

  // ─── Create Proposals ──────────────────────────────────────────────
  console.log("📋 Creating proposals...");
  const proposalStatuses = ["PENDING", "ACCEPTED", "REJECTED", "COUNTER", "PENDING", "ACCEPTED"];
  const createdProposals = [];

  for (let i = 0; i < 12; i++) {
    const buyer = createdBuyers[i % createdBuyers.length];
    const product = createdProducts[i % createdProducts.length];
    const farmer = createdFarmers.find(f => f.id === product.farmerId)!;
    const qty = randomBetween(10, 200);
    const pricePerUnit = product.price * (1 - randomBetween(5, 15) / 100);
    const status = proposalStatuses[i % proposalStatuses.length];

    const proposal = await prisma.proposal.create({
      data: {
        senderId: buyer.id,
        receiverId: farmer.id,
        productId: product.id,
        quantity: qty,
        pricePerUnit: Math.round(pricePerUnit),
        totalPrice: Math.round(qty * pricePerUnit),
        message: [
          "We are interested in bulk purchase for our retail chain. Can you offer competitive pricing?",
          "Requesting samples before committing to large order. Quality is our top priority.",
          "We need this product for upcoming festival season. Urgent delivery required.",
          "Looking for long-term supply partnership. Monthly orders of consistent quality.",
        ][i % 4],
        status,
        validUntil: daysFromNow(randomBetween(7, 30)),
        createdAt: daysAgo(randomBetween(1, 30)),
      },
    });
    createdProposals.push(proposal);
    console.log(`  ✓ Proposal: ${buyer.name} → ${farmer.name} for ${product.name} [${status}]`);
  }
  console.log(`✓ Created ${createdProposals.length} proposals\n`);

  // ─── Create Reviews ────────────────────────────────────────────────
  console.log("⭐ Creating reviews...");
  const reviewComments = [
    "Excellent quality! Exactly as described. Will order again.",
    "Good product but packaging could be better. Overall satisfied.",
    "Outstanding craftsmanship. The artisan's skill is evident in every detail.",
    "Decent quality for the price. Delivery was on time.",
    "Premium grade product. My customers loved it. Highly recommended!",
    "Very good quality. Communication with the farmer was excellent throughout.",
    "Average quality compared to expectations. But fair pricing.",
    "Superb! This is authentic ODOP quality. Five stars!",
    "Product met our quality standards. Packaging was eco-friendly which we appreciate.",
    "Great value for money. Consistent quality across all units in the batch.",
  ];

  let reviewCount = 0;
  for (let i = 0; i < 20; i++) {
    const buyer = createdBuyers[i % createdBuyers.length];
    const product = createdProducts[i % createdProducts.length];
    const farmer = createdFarmers.find(f => f.id === product.farmerId)!;

    await prisma.review.create({
      data: {
        authorId: buyer.id,
        targetId: farmer.id,
        productId: product.id,
        rating: randomBetween(3, 5),
        comment: reviewComments[i % reviewComments.length],
        createdAt: daysAgo(randomBetween(1, 90)),
      },
    });
    reviewCount++;
  }
  console.log(`✓ Created ${reviewCount} reviews\n`);

  // ─── Create Tenders ────────────────────────────────────────────────
  console.log("📑 Creating tenders...");
  const tenderData = [
    { title: "Bulk Organic Turmeric Supply — Q1 2026", description: "Seeking 5000kg of organic turmeric (min 5% curcumin content). FSSAI and organic certification required. Delivery to Mumbai warehouse.", category: "Spices", quantity: 5000, unit: "kg", maxPrice: 300, status: "OPEN", daysToDeadline: 15, apps: 3 },
    { title: "Premium Basmati Rice for Export", description: "Need 20 tons of aged Basmati 1121 for Middle East export. Must meet export quality standards with proper fumigation certificates.", category: "Grains", quantity: 20000, unit: "kg", maxPrice: 130, status: "OPEN", daysToDeadline: 20, apps: 2 },
    { title: "Handloom Textiles for Government Exhibition", description: "State government procurement for handloom exhibition. Need variety of textiles including silk sarees, cotton fabric, and shawls. GI tag preferred.", category: "Textiles", quantity: 200, unit: "piece", maxPrice: 5000, status: "OPEN", daysToDeadline: 10, apps: 4 },
    { title: "Artisanal Handicrafts Collection — Museum Store", description: "Curating authentic Indian handicrafts for national museum gift shop. Focus on blue pottery, wooden crafts, and metal work with documentation.", category: "Handicrafts", quantity: 100, unit: "piece", maxPrice: 2000, status: "AWARDED", daysToDeadline: -5, apps: 5 },
    { title: "Makhana Supply for Snack Manufacturing", description: "Continuous supply of Grade A Makhana for our premium snack line. Monthly delivery of 500kg. Long-term contract preferred.", category: "Snacks", quantity: 500, unit: "kg", maxPrice: 650, status: "CLOSED", daysToDeadline: -15, apps: 3 },
  ];

  for (const td of tenderData) {
    const creator = createdBuyers[tenderData.indexOf(td) % createdBuyers.length];
    const tender = await prisma.tender.create({
      data: {
        creatorId: creator.id,
        title: td.title,
        description: td.description,
        category: td.category,
        quantity: td.quantity,
        unit: td.unit,
        maxPrice: td.maxPrice,
        status: td.status,
        deadline: td.daysToDeadline > 0 ? daysFromNow(td.daysToDeadline) : daysAgo(Math.abs(td.daysToDeadline)),
        createdAt: daysAgo(randomBetween(10, 40)),
      },
    });

    // Create applications for each tender
    for (let a = 0; a < td.apps; a++) {
      const applicant = createdFarmers[a % createdFarmers.length];
      await prisma.tenderApplication.create({
        data: {
          tenderId: tender.id,
          applicantId: applicant.id,
          priceOffer: td.maxPrice * (1 - randomBetween(5, 25) / 100),
          message: `We can supply ${td.quantity} ${td.unit} of high-quality ${td.category}. We have ${randomBetween(2, 15)} years of experience.`,
          status: td.status === "AWARDED" && a === 0 ? "ACCEPTED" : td.status === "AWARDED" ? "REJECTED" : "PENDING",
          createdAt: daysAgo(randomBetween(1, 15)),
        },
      });
    }
    console.log(`  ✓ Tender: "${td.title}" [${td.status}] — ${td.apps} applications`);
  }
  console.log(`✓ Created ${tenderData.length} tenders with applications\n`);

  // ─── Create Notifications ──────────────────────────────────────────
  console.log("🔔 Creating notifications...");
  const notifications = [
    { type: "ORDER", title: "New Order Received", message: "You have a new order #ODOP100001 for Banarasi Silk Saree (qty: 25)" },
    { type: "PROPOSAL", title: "New Proposal", message: "Rajesh Kumar has sent a proposal for your Organic Turmeric at ₹265/kg" },
    { type: "MESSAGE", title: "New Message", message: "You have a new message from Priya Sharma regarding Kanchipuram Silk" },
    { type: "TENDER", title: "Tender Application Accepted", message: "Your application for 'Bulk Organic Turmeric Supply' has been accepted!" },
    { type: "SYSTEM", title: "KYC Verified", message: "Your KYC documents have been verified. You can now access all platform features." },
    { type: "ORDER", title: "Order Shipped", message: "Order #ODOP100003 has been shipped. Track with ID: ODOP100003" },
    { type: "PROPOSAL", title: "Proposal Accepted", message: "Your proposal for Alphonso Mango has been accepted by Bhushan Patil" },
    { type: "SYSTEM", title: "New Feature: AI Quality Grading", message: "Try our new AI-powered quality grading! Upload product images to get instant grades." },
    { type: "ORDER", title: "Order Delivered", message: "Order #ODOP100005 has been delivered successfully. Please leave a review." },
    { type: "TENDER", title: "New Tender Available", message: "A new tender for Premium Basmati Rice has been posted. Deadline: 20 days." },
  ];

  const allUsers = [...createdFarmers, ...createdBuyers];
  for (let i = 0; i < notifications.length; i++) {
    const user = allUsers[i % allUsers.length];
    const n = notifications[i];
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: i < 4,
        createdAt: daysAgo(i),
      },
    });
  }
  console.log(`✓ Created ${notifications.length} notifications\n`);

  // ─── Create Contracts ──────────────────────────────────────────────
  console.log("📄 Creating contracts...");
  const contractData = [
    { buyer: 0, farmer: 0, value: 112500, terms: "Supply of 25 Banarasi Silk Sarees at ₹4500/piece. Delivery within 30 days. Quality: Grade A minimum. Payment: 50% advance, 50% on delivery. Returns accepted within 7 days for manufacturing defects only.", status: "ACTIVE" },
    { buyer: 1, farmer: 2, terms: "Supply of 50 Blue Pottery Vases at ₹1000/piece. Monthly delivery of 10 pieces for 5 months. Quality inspection at Jaipur warehouse before dispatch.", value: 50000, status: "ACTIVE" },
    { buyer: 2, farmer: 1, terms: "Annual supply contract for Kanchipuram Silk. Minimum 100 sarees per year. Pricing reviewed quarterly based on raw material costs.", value: 620000, status: "DRAFT" },
    { buyer: 3, farmer: 3, terms: "Bulk coconut oil supply. 200 liters/month for 6 months. FSSAI compliant packaging. Temperature-controlled transportation mandatory.", value: 264000, status: "COMPLETED" },
  ];

  for (const cd of contractData) {
    await prisma.contract.create({
      data: {
        buyerId: createdBuyers[cd.buyer].id,
        farmerId: createdFarmers[cd.farmer].id,
        terms: cd.terms,
        totalValue: cd.value,
        status: cd.status,
        blockchainHash: cd.status !== "DRAFT" ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` : null,
        signedAt: cd.status === "ACTIVE" || cd.status === "COMPLETED" ? daysAgo(randomBetween(10, 60)) : null,
        expiresAt: cd.status !== "COMPLETED" ? daysFromNow(randomBetween(90, 365)) : daysAgo(randomBetween(1, 30)),
        createdAt: daysAgo(randomBetween(15, 90)),
      },
    });
    console.log(`  ✓ Contract: ${createdBuyers[cd.buyer].name} ↔ ${createdFarmers[cd.farmer].name} [${cd.status}] ₹${cd.value}`);
  }
  console.log(`✓ Created ${contractData.length} contracts\n`);

  // ─── Create Sample Requests ────────────────────────────────────────
  console.log("📦 Creating sample requests...");
  const sampleStatuses = ["PENDING", "APPROVED", "SHIPPED", "RECEIVED"];
  for (let i = 0; i < 6; i++) {
    const buyer = createdBuyers[i % createdBuyers.length];
    const product = createdProducts[i * 3 % createdProducts.length];
    await prisma.sampleRequest.create({
      data: {
        requesterId: buyer.id,
        productId: product.id,
        quantity: randomBetween(1, 5),
        message: `Would like to evaluate ${product.name} quality before bulk order. Please send samples to my ${buyer.district} office.`,
        status: sampleStatuses[i % sampleStatuses.length],
        shippingAddress: `${buyer.name}, ${buyer.district}, ${buyer.state} - ${randomBetween(100000, 999999)}`,
        createdAt: daysAgo(randomBetween(3, 20)),
      },
    });
  }
  console.log(`✓ Created 6 sample requests\n`);

  // ─── Create Logistics ──────────────────────────────────────────────
  console.log("🚚 Skipping logistics entries (not in schema)...");

  // ─── Summary ───────────────────────────────────────────────────────
  console.log("━".repeat(50));
  console.log("✅ SEED COMPLETE!\n");
  console.log("📊 Summary:");
  console.log(`   Users:          ${createdFarmers.length} farmers + ${createdBuyers.length} buyers`);
  console.log(`   Products:       ${createdProducts.length}`);
  console.log(`   Orders:         ${createdOrders.length}`);
  console.log(`   Messages:       ${msgCount}`);
  console.log(`   Proposals:      ${createdProposals.length}`);
  console.log(`   Reviews:        ${reviewCount}`);
  console.log(`   Tenders:        ${tenderData.length} (with applications)`);
  console.log(`   Notifications:  ${notifications.length}`);
  console.log(`   Contracts:      ${contractData.length}`);
  console.log(`   Sample Requests: 6`);
  console.log(`   Logistics:      ${shippedOrders.length}`);
  console.log("");
  console.log("🔑 Login Credentials (all users):");
  console.log("   Password: Test@1234");
  console.log("");
  console.log("   Farmers:");
  for (const f of farmers) {
    console.log(`     ${f.name}: ${f.email}`);
  }
  console.log("   Buyers:");
  for (const b of buyers) {
    console.log(`     ${b.name}: ${b.email}`);
  }
  console.log("\n━".repeat(50));
}

// ─── Execute ──────────────────────────────────────────────────────────

seed()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
