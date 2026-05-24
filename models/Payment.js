/**
 * Payment Model
 * Represents a payment made to a distributor
 */

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Distributor',
      required: [true, 'Distributor reference is required'],
    },
    distributorName: {
      type: String,
      required: [true, 'Distributor name is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: String,
      required: [true, 'Payment date is required'],
    },
    method: {
      type: String,
      enum: ['UPI', 'Bank Transfer', 'Cash'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
    reference: {
      type: String,
      trim: true,
      default: '-',
    },
  },
  {
    timestamps: true,
  }
);

/** Index for status-based filtering */
paymentSchema.index({ status: 1 });
/** Index for distributor lookups */
paymentSchema.index({ distributorId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
