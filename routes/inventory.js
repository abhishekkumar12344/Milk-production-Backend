import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Inventory from '../models/Inventory.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;
    const inventory = await Inventory.find(filter).sort({ createdAt: -1 });
    const totalValue = inventory.reduce((s,i) => s + (i.quantity * (i.price||0)), 0);
    res.json({ success: true, count: inventory.length, totalValue, data: inventory });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) throw new AppError('Item not found', 404);
    res.json({ success: true, data: item });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { item, category, quantity, unit, capacity, minStock, price, expiry, location } = req.body;
    if (!item || quantity === undefined || !unit || capacity === undefined || !expiry) throw new AppError('item, quantity, unit, capacity, expiry required', 400);
    const inv = await Inventory.create({ item, category, quantity, unit, capacity, minStock, price, expiry, location });
    res.status(201).json({ success: true, data: inv });
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const inv = await Inventory.findById(req.params.id);
    if (!inv) throw new AppError('Item not found', 404);
    ['item','category','quantity','unit','capacity','minStock','price','expiry','location'].forEach(f => {
      if (req.body[f] !== undefined) inv[f] = req.body[f];
    });
    await inv.save();
    res.json({ success: true, data: inv });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const inv = await Inventory.findByIdAndDelete(req.params.id);
    if (!inv) throw new AppError('Item not found', 404);
    res.json({ success: true, message: 'Deleted', data: inv });
  } catch (e) { next(e); }
});

// Add analytics route for inventory
router.get('/analytics/summary', async (req, res, next) => {
  try {
    const byCategory = await Inventory.aggregate([
      { $group: { _id: '$category', count: { $sum:1 }, totalQty: { $sum:'$quantity' }, totalValue: { $sum: { $multiply: ['$quantity','$price'] } } } },
    ]);
    res.json({ success: true, data: byCategory });
  } catch (e) { next(e); }
});

export default router;
