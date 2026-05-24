/**
 * Payment Controller
 * Business logic for payment operations
 */

import Payment from '../models/Payment.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all payments with optional status filter and search.
 * Supports query params: ?status=Paid|Pending&search=xxx
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const getAllPayments = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    // Build filter object
    const filter = {};

    if (status && status.trim()) {
      const statusTrim = status.trim();
      if (!['Paid', 'Pending'].includes(statusTrim)) {
        throw new AppError('Status must be either Paid or Pending', 400);
      }
      filter.status = statusTrim;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { distributorName: searchRegex },
        { reference: searchRegex },
      ];
    }

    const payments = await Payment.find(filter)
      .populate('distributorId', 'name village phone')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a payment as paid
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const markPaymentAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.status === 'Paid') {
      throw new AppError('Payment is already marked as paid', 400);
    }

    payment.status = 'Paid';

    // Allow updating reference if provided
    if (req.body.reference) {
      payment.reference = req.body.reference;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment marked as paid successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllPayments,
  markPaymentAsPaid,
};
