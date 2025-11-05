// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.alert.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supplierDrug.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.drug.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');
  

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@drugsinventory.com',
        password: '$2a$10$YourHashedPasswordHere', // Use bcrypt to hash passwords
        firstName: 'John',
        lastName: 'Admin',
        role: 'ADMIN',
        phone: '+1234567890',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'pharmacist@drugsinventory.com',
        password: '$2a$10$YourHashedPasswordHere',
        firstName: 'Jane',
        lastName: 'Pharmacist',
        role: 'PHARMACIST',
        phone: '+1234567891',
        isActive: true,
      },
    }),
  ]);

  const adminUser = users[0];
  const pharmacistUser = users[1];

  console.log('✅ Created users');

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'PharmaCorp International',
        contactPerson: 'Mike Johnson',
        email: 'contact@pharmacorp.com',
        phone: '+1234567892',
        address: '123 Pharma Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        taxId: 'TAX123456',
        paymentTerms: 'Net 30',
        isActive: true,
        rating: 4.5,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'MediSupply Ltd',
        contactPerson: 'Sarah Williams',
        email: 'info@medisupply.com',
        phone: '+1234567893',
        address: '456 Medical Ave',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        postalCode: '02101',
        taxId: 'TAX789012',
        paymentTerms: 'Net 45',
        isActive: true,
        rating: 4.8,
      },
    }),
  ]);

  console.log('✅ Created suppliers');

  // Create Locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Main Warehouse',
        type: 'Warehouse',
        building: 'Building A',
        floor: '1',
        section: 'North',
        aisle: 'A1',
        shelf: 'S1',
        capacity: 10000,
        temperature: 20.0,
        humidity: 45.0,
        isActive: true,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Cold Storage',
        type: 'Refrigerated',
        building: 'Building B',
        floor: '1',
        section: 'Cold Room',
        aisle: 'C1',
        shelf: 'S1',
        capacity: 2000,
        temperature: 4.0,
        humidity: 60.0,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created locations');

  // Create Drugs - NOW WITH USER CONNECTION
  const drugs = await Promise.all([
    prisma.drug.create({
      data: {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        brandName: 'Amoxil',
        category: 'ANTIBIOTIC',
        form: 'CAPSULE',
        strength: '500mg',
        manufacturer: 'PharmaCorp International',
        description: 'Antibiotic used to treat bacterial infections',
        activeIngredient: 'Amoxicillin trihydrate',
        prescriptionRequired: 'YES',
        barcode: '1234567890001',
        sku: 'AMOX-500-CAP',
        storageCondition: 'ROOM_TEMPERATURE',
        minimumStockLevel: 100,
        reorderLevel: 200,
        isActive: true,
        user: {
          connect: { id: adminUser.id }
        }
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        brandName: 'Tylenol',
        category: 'ANALGESIC',
        form: 'TABLET',
        strength: '500mg',
        manufacturer: 'MediSupply Ltd',
        description: 'Pain reliever and fever reducer',
        activeIngredient: 'Paracetamol',
        prescriptionRequired: 'NO',
        barcode: '1234567890002',
        sku: 'PARA-500-TAB',
        storageCondition: 'ROOM_TEMPERATURE',
        minimumStockLevel: 200,
        reorderLevel: 400,
        isActive: true,
        user: {
          connect: { id: adminUser.id }
        }
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Insulin Glargine',
        genericName: 'Insulin Glargine',
        brandName: 'Lantus',
        category: 'ENDOCRINE',
        form: 'INJECTION',
        strength: '100 units/mL',
        manufacturer: 'PharmaCorp International',
        description: 'Long-acting insulin for diabetes management',
        activeIngredient: 'Insulin Glargine',
        prescriptionRequired: 'YES',
        barcode: '1234567890003',
        sku: 'INS-100-INJ',
        storageCondition: 'REFRIGERATED',
        minimumStockLevel: 50,
        reorderLevel: 100,
        isActive: true,
        user: {
          connect: { id: adminUser.id }
        }
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        brandName: 'Prinivil',
        category: 'CARDIOVASCULAR',
        form: 'TABLET',
        strength: '10mg',
        manufacturer: 'MediSupply Ltd',
        description: 'ACE inhibitor for high blood pressure',
        activeIngredient: 'Lisinopril dihydrate',
        prescriptionRequired: 'YES',
        barcode: '1234567890004',
        sku: 'LISI-10-TAB',
        storageCondition: 'ROOM_TEMPERATURE',
        minimumStockLevel: 150,
        reorderLevel: 300,
        isActive: true,
        user: {
          connect: { id: pharmacistUser.id }
        }
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Vitamin D3',
        genericName: 'Cholecalciferol',
        brandName: 'VitaD',
        category: 'VITAMIN_SUPPLEMENT',
        form: 'CAPSULE',
        strength: '1000 IU',
        manufacturer: 'PharmaCorp International',
        description: 'Vitamin D supplement',
        activeIngredient: 'Cholecalciferol',
        prescriptionRequired: 'NO',
        barcode: '1234567890005',
        sku: 'VITD-1000-CAP',
        storageCondition: 'ROOM_TEMPERATURE',
        minimumStockLevel: 300,
        reorderLevel: 500,
        isActive: true,
        user: {
          connect: { id: pharmacistUser.id }
        }
      },
    }),
  ]);

  console.log('✅ Created drugs');

  // Create Batches for each drug
  const batches = await Promise.all([
    // Amoxicillin batch
    prisma.batch.create({
      data: {
        batchNumber: 'BATCH-AMOX-001',
        drugId: drugs[0].id,
        quantityReceived: 1000,
        quantityAvailable: 850,
        quantityReserved: 0,
        unitPrice: 0.50,
        sellingPrice: 1.20,
        manufactureDate: new Date('2024-01-15'),
        expiryDate: new Date('2026-01-15'),
        supplierId: suppliers[0].id,
        locationId: locations[0].id,
        status: 'IN_STOCK',
      },
    }),
    // Paracetamol batch
    prisma.batch.create({
      data: {
        batchNumber: 'BATCH-PARA-001',
        drugId: drugs[1].id,
        quantityReceived: 2000,
        quantityAvailable: 1800,
        quantityReserved: 0,
        unitPrice: 0.10,
        sellingPrice: 0.30,
        manufactureDate: new Date('2024-02-01'),
        expiryDate: new Date('2026-02-01'),
        supplierId: suppliers[1].id,
        locationId: locations[0].id,
        status: 'IN_STOCK',
      },
    }),
    // Insulin batch (refrigerated)
    prisma.batch.create({
      data: {
        batchNumber: 'BATCH-INS-001',
        drugId: drugs[2].id,
        quantityReceived: 200,
        quantityAvailable: 45,
        quantityReserved: 5,
        unitPrice: 25.00,
        sellingPrice: 45.00,
        manufactureDate: new Date('2024-03-01'),
        expiryDate: new Date('2025-03-01'),
        supplierId: suppliers[0].id,
        locationId: locations[1].id,
        status: 'LOW_STOCK',
      },
    }),
    // Lisinopril batch
    prisma.batch.create({
      data: {
        batchNumber: 'BATCH-LISI-001',
        drugId: drugs[3].id,
        quantityReceived: 500,
        quantityAvailable: 420,
        quantityReserved: 0,
        unitPrice: 0.30,
        sellingPrice: 0.75,
        manufactureDate: new Date('2024-01-20'),
        expiryDate: new Date('2026-01-20'),
        supplierId: suppliers[1].id,
        locationId: locations[0].id,
        status: 'IN_STOCK',
      },
    }),
    // Vitamin D3 batch
    prisma.batch.create({
      data: {
        batchNumber: 'BATCH-VITD-001',
        drugId: drugs[4].id,
        quantityReceived: 1000,
        quantityAvailable: 3,
        quantityReserved: 0,
        unitPrice: 0.15,
        sellingPrice: 0.40,
        manufactureDate: new Date('2024-02-15'),
        expiryDate: new Date('2027-02-15'),
        supplierId: suppliers[0].id,
        locationId: locations[0].id,
        status: 'LOW_STOCK',
      },
    }),
  ]);

  console.log('✅ Created batches');

  // Create Supplier-Drug relationships
  await Promise.all([
    prisma.supplierDrug.create({
      data: {
        supplierId: suppliers[0].id,
        drugId: drugs[0].id,
        supplierSku: 'PC-AMOX-500',
        unitPrice: 0.50,
        minimumOrder: 100,
        leadTimeDays: 7,
        isPreferred: true,
      },
    }),
    prisma.supplierDrug.create({
      data: {
        supplierId: suppliers[1].id,
        drugId: drugs[1].id,
        supplierSku: 'MS-PARA-500',
        unitPrice: 0.10,
        minimumOrder: 200,
        leadTimeDays: 5,
        isPreferred: true,
      },
    }),
  ]);

  console.log('✅ Created supplier-drug relationships');

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        phone: '+1234567894',
        dateOfBirth: new Date('1985-05-15'),
        address: '789 Patient St',
        city: 'New York',
        state: 'NY',
        postalCode: '10002',
        allergies: 'Penicillin',
        prescriptionNumber: 'RX-2024-001',
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1234567895',
        dateOfBirth: new Date('1972-08-22'),
        address: '321 Health Ave',
        city: 'Boston',
        state: 'MA',
        postalCode: '02102',
        allergies: null,
        prescriptionNumber: 'RX-2024-002',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created customers');

  // Create Transactions
  await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'SALE',
        drugId: drugs[0].id,
        batchId: batches[0].id,
        quantity: 30,
        unitPrice: 1.20,
        totalPrice: 36.00,
        userId: pharmacistUser.id,
        customerId: customers[0].id,
        referenceNumber: 'TXN-2024-001',
        notes: 'Regular prescription refill',
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'PURCHASE',
        drugId: drugs[1].id,
        batchId: batches[1].id,
        quantity: 2000,
        unitPrice: 0.10,
        totalPrice: 200.00,
        userId: adminUser.id,
        referenceNumber: 'PO-2024-001',
        notes: 'Monthly stock replenishment',
      },
    }),
  ]);

  console.log('✅ Created transactions');

  // Create Orders
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      supplierId: suppliers[0].id,
      userId: adminUser.id,
      status: 'PENDING',
      totalAmount: 1250.00,
      shippingCost: 50.00,
      tax: 125.00,
      notes: 'Urgent restock order',
      items: {
        create: [
          {
            drugId: drugs[2].id,
            quantity: 200,
            unitPrice: 25.00,
            totalPrice: 5000.00,
          },
          {
            drugId: drugs[4].id,
            quantity: 500,
            unitPrice: 0.15,
            totalPrice: 75.00,
          },
        ],
      },
    },
  });

  console.log('✅ Created orders');

  // Create Alerts
  await Promise.all([
    prisma.alert.create({
      data: {
        type: 'LOW_STOCK',
        severity: 'WARNING',
        message: 'Insulin Glargine stock is running low (45 units remaining)',
        drugId: drugs[2].id,
        userId: adminUser.id,
        isRead: false,
        isResolved: false,
      },
    }),
    prisma.alert.create({
      data: {
        type: 'LOW_STOCK',
        severity: 'CRITICAL',
        message: 'Vitamin D3 stock is critically low (3 units remaining)',
        drugId: drugs[4].id,
        userId: adminUser.id,
        isRead: false,
        isResolved: false,
      },
    }),
    prisma.alert.create({
      data: {
        type: 'EXPIRY_WARNING',
        severity: 'INFO',
        message: 'Insulin batch expiring in 4 months',
        drugId: drugs[2].id,
        userId: adminUser.id,
        isRead: false,
        isResolved: false,
      },
    }),
  ]);

  console.log('✅ Created alerts');

  // Create Audit
  await prisma.audit.create({
    data: {
      auditNumber: 'AUD-2024-001',
      userId: adminUser.id,
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-12-01'),
      notes: 'Quarterly inventory audit',
    },
  });

  console.log('✅ Created audit');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });