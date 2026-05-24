/**
 * Seed Data Module for DairyFlow
 * Contains all the mock data from the original frontend-only application
 * and a seedDatabase function to populate the MongoDB database
 */

import Distributor from '../models/Distributor.js';
import MilkCollection from '../models/MilkCollection.js';
import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';
import MonthlyData from '../models/MonthlyData.js';
import DailyData from '../models/DailyData.js';

/* ============================================================
   MOCK DATA (from original DairyFlow.jsx)
   ============================================================ */

const MOCK_DISTRIBUTORS = [
  { name: 'Ramesh Kumar', village: 'Sundarpur', phone: '9876543210', address: 'Near Temple, Sundarpur', aadhaar: 'XXXX-XXXX-1234', bank: 'SBI - 1234567890', milkType: 'Cow', joinDate: '2022-01-15', status: 'Active', totalLiters: 12450, totalAmount: 623450 },
  { name: 'Suresh Yadav', village: 'Ramgarh', phone: '9812345678', address: 'Main Road, Ramgarh', aadhaar: 'XXXX-XXXX-5678', bank: 'PNB - 9876543210', milkType: 'Buffalo', joinDate: '2021-06-20', status: 'Active', totalLiters: 18200, totalAmount: 1092000 },
  { name: 'Priya Devi', village: 'Khandwa', phone: '9934567890', address: 'Sector 2, Khandwa', aadhaar: 'XXXX-XXXX-9012', bank: 'BOI - 5678901234', milkType: 'Cow', joinDate: '2023-03-10', status: 'Active', totalLiters: 6800, totalAmount: 340000 },
  { name: 'Mohan Singh', village: 'Birpur', phone: '9756789012', address: 'Old Colony, Birpur', aadhaar: 'XXXX-XXXX-3456', bank: 'HDFC - 2345678901', milkType: 'Buffalo', joinDate: '2020-11-05', status: 'Inactive', totalLiters: 21000, totalAmount: 1260000 },
  { name: 'Gita Sharma', village: 'Lakshmipur', phone: '9867890123', address: 'Green Field, Lakshmipur', aadhaar: 'XXXX-XXXX-7890', bank: 'Axis - 3456789012', milkType: 'Cow', joinDate: '2022-08-22', status: 'Active', totalLiters: 9350, totalAmount: 467500 },
  { name: 'Vijay Patil', village: 'Sundarpur', phone: '9678901234', address: 'Near School, Sundarpur', aadhaar: 'XXXX-XXXX-2345', bank: 'Canara - 4567890123', milkType: 'Buffalo', joinDate: '2021-02-14', status: 'Active', totalLiters: 15600, totalAmount: 936000 },
];

const MILK_COLLECTIONS = [
  { distributorName: 'Ramesh Kumar', date: '2025-01-15', shift: 'Morning', quantity: 45.5, fat: 3.8, pricePerLiter: 52, total: 2366, status: 'Paid' },
  { distributorName: 'Suresh Yadav', date: '2025-01-15', shift: 'Morning', quantity: 62, fat: 6.2, pricePerLiter: 62, total: 3844, status: 'Paid' },
  { distributorName: 'Priya Devi', date: '2025-01-15', shift: 'Evening', quantity: 28, fat: 3.5, pricePerLiter: 50, total: 1400, status: 'Pending' },
  { distributorName: 'Gita Sharma', date: '2025-01-15', shift: 'Morning', quantity: 38.5, fat: 4.0, pricePerLiter: 54, total: 2079, status: 'Paid' },
  { distributorName: 'Vijay Patil', date: '2025-01-15', shift: 'Evening', quantity: 55, fat: 5.8, pricePerLiter: 60, total: 3300, status: 'Pending' },
  { distributorName: 'Ramesh Kumar', date: '2025-01-14', shift: 'Morning', quantity: 43, fat: 3.9, pricePerLiter: 52, total: 2236, status: 'Paid' },
  { distributorName: 'Suresh Yadav', date: '2025-01-14', shift: 'Evening', quantity: 58, fat: 6.0, pricePerLiter: 62, total: 3596, status: 'Paid' },
];

const MONTHLY_DATA = [
  { month: 'Jul', collected: 4200, revenue: 252000, profit: 42000, expense: 210000 },
  { month: 'Aug', collected: 4800, revenue: 288000, profit: 51000, expense: 237000 },
  { month: 'Sep', collected: 5100, revenue: 306000, profit: 58000, expense: 248000 },
  { month: 'Oct', collected: 4600, revenue: 276000, profit: 44000, expense: 232000 },
  { month: 'Nov', collected: 5300, revenue: 318000, profit: 63000, expense: 255000 },
  { month: 'Dec', collected: 5800, revenue: 348000, profit: 72000, expense: 276000 },
  { month: 'Jan', collected: 6200, revenue: 372000, profit: 81000, expense: 291000 },
];

const DAILY_DATA = [
  { day: 'Mon', morning: 185, evening: 142 },
  { day: 'Tue', morning: 210, evening: 168 },
  { day: 'Wed', morning: 195, evening: 155 },
  { day: 'Thu', morning: 228, evening: 180 },
  { day: 'Fri', morning: 242, evening: 192 },
  { day: 'Sat', morning: 198, evening: 165 },
  { day: 'Sun', morning: 175, evening: 138 },
];

const EXPENSES = [
  { category: 'Transportation', amount: 12500, date: '2025-01-15', note: 'Truck fuel & driver' },
  { category: 'Storage', amount: 8200, date: '2025-01-15', note: 'Cold storage rent' },
  { category: 'Electricity', amount: 4600, date: '2025-01-14', note: 'Monthly electric bill' },
  { category: 'Staff Salary', amount: 35000, date: '2025-01-10', note: '3 staff members' },
  { category: 'Maintenance', amount: 2800, date: '2025-01-12', note: 'Equipment repair' },
];

const PAYMENTS = [
  { distributorName: 'Ramesh Kumar', amount: 25400, date: '2025-01-15', method: 'UPI', status: 'Paid', reference: 'UPI202501151' },
  { distributorName: 'Suresh Yadav', amount: 42000, date: '2025-01-15', method: 'Bank Transfer', status: 'Paid', reference: 'NEFT202501152' },
  { distributorName: 'Priya Devi', amount: 18600, date: '2025-01-14', method: 'Cash', status: 'Pending', reference: '-' },
  { distributorName: 'Gita Sharma', amount: 21200, date: '2025-01-13', method: 'UPI', status: 'Paid', reference: 'UPI202501134' },
  { distributorName: 'Vijay Patil', amount: 33800, date: '2025-01-13', method: 'Cash', status: 'Pending', reference: '-' },
];

const NOTIFICATIONS = [
  { type: 'warning', message: 'Pending payment of ₹18,600 from Priya Devi', time: '2h ago', read: false },
  { type: 'danger', message: 'Cold storage at 85% capacity – check inventory', time: '4h ago', read: false },
  { type: 'info', message: 'Monthly report for December is ready to download', time: '1d ago', read: true },
  { type: 'warning', message: 'Pending payment of ₹33,800 from Vijay Patil', time: '1d ago', read: false },
  { type: 'success', message: '₹42,000 payment received from Suresh Yadav', time: '2d ago', read: true },
];

const INVENTORY = [
  { item: 'Fresh Cow Milk', quantity: 1250, unit: 'L', capacity: 2000, expiry: '2025-01-17', status: 'Good' },
  { item: 'Buffalo Milk', quantity: 820, unit: 'L', capacity: 1500, expiry: '2025-01-17', status: 'Good' },
  { item: 'Processed Milk Packets', quantity: 340, unit: 'pcs', capacity: 1000, expiry: '2025-01-20', status: 'Good' },
  { item: 'Cream', quantity: 45, unit: 'kg', capacity: 100, expiry: '2025-01-18', status: 'Low' },
  { item: 'Butter', quantity: 12, unit: 'kg', capacity: 80, expiry: '2025-01-25', status: 'Critical' },
];

/* ============================================================
   EXPENSE PIE DATA (for chart visualization reference)
   ============================================================ */
const EXPENSE_PIE = [
  { name: 'Transportation', value: 12500, color: '#3b82f6' },
  { name: 'Storage', value: 8200, color: '#10b981' },
  { name: 'Electricity', value: 4600, color: '#f59e0b' },
  { name: 'Staff Salary', value: 35000, color: '#8b5cf6' },
  { name: 'Maintenance', value: 2800, color: '#ef4444' },
];

/**
 * Seed the database with all mock data.
 * Clears existing data and inserts fresh records.
 * Resolves foreign key references (distributorId) by matching distributor names.
 *
 * @async
 * @returns {Promise<Object>} Summary of seeded record counts
 */
const seedDatabase = async () => {
  try {
    // Clear all collections
    await Distributor.deleteMany({});
    await MilkCollection.deleteMany({});
    await Payment.deleteMany({});
    await Expense.deleteMany({});
    await Inventory.deleteMany({});
    await Notification.deleteMany({});
    await MonthlyData.deleteMany({});
    await DailyData.deleteMany({});

    console.log('Cleared all existing data...');

    // 1. Seed Distributors
    const seededDistributors = await Distributor.insertMany(
      MOCK_DISTRIBUTORS.map((d) => ({
        ...d,
        joinDate: new Date(d.joinDate),
      }))
    );
    console.log(`Seeded ${seededDistributors.length} distributors`);

    // Create a name-to-id lookup map
    const distributorMap = {};
    seededDistributors.forEach((d) => {
      distributorMap[d.name] = d._id;
    });

    // 2. Seed Milk Collections (resolve distributorId from name)
    const milkCollectionDocs = MILK_COLLECTIONS.map((m) => ({
      ...m,
      distributorId: distributorMap[m.distributorName],
    })).filter((m) => m.distributorId);

    const seededCollections = await MilkCollection.insertMany(milkCollectionDocs);
    console.log(`Seeded ${seededCollections.length} milk collections`);

    // 3. Seed Payments (resolve distributorId from name)
    const paymentDocs = PAYMENTS.map((p) => ({
      ...p,
      distributorId: distributorMap[p.distributorName],
    })).filter((p) => p.distributorId);

    const seededPayments = await Payment.insertMany(paymentDocs);
    console.log(`Seeded ${seededPayments.length} payments`);

    // 4. Seed Expenses
    const seededExpenses = await Expense.insertMany(EXPENSES);
    console.log(`Seeded ${seededExpenses.length} expenses`);

    // 5. Seed Inventory
    const seededInventory = await Inventory.insertMany(INVENTORY);
    console.log(`Seeded ${seededInventory.length} inventory items`);

    // 6. Seed Notifications
    const seededNotifications = await Notification.insertMany(NOTIFICATIONS);
    console.log(`Seeded ${seededNotifications.length} notifications`);

    // 7. Seed Monthly Data
    const seededMonthly = await MonthlyData.insertMany(MONTHLY_DATA);
    console.log(`Seeded ${seededMonthly.length} monthly data records`);

    // 8. Seed Daily Data
    const seededDaily = await DailyData.insertMany(DAILY_DATA);
    console.log(`Seeded ${seededDaily.length} daily data records`);

    const summary = {
      distributors: seededDistributors.length,
      milkCollections: seededCollections.length,
      payments: seededPayments.length,
      expenses: seededExpenses.length,
      inventory: seededInventory.length,
      notifications: seededNotifications.length,
      monthlyData: seededMonthly.length,
      dailyData: seededDaily.length,
    };

    console.log('Database seeding completed successfully!');
    return summary;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export {
  MOCK_DISTRIBUTORS,
  MILK_COLLECTIONS,
  MONTHLY_DATA,
  DAILY_DATA,
  EXPENSES,
  PAYMENTS,
  NOTIFICATIONS,
  INVENTORY,
  EXPENSE_PIE,
  seedDatabase,
};
