/**
 * Production Model
 * Tracks milk processing and production batches with cost analysis
 */

import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema(
  {
    process: {
      type: String,
      enum: ['Pasteurization', 'Paneer Making', 'Ghee Preparation', 'Butter Churning', 'Yogurt Making', 'Other'],
      required: [true, 'Process type is required'],
    },
    inputQuantity: {
      type: Number,
      required: [true, 'Input quantity is required'],
      min: [0, 'Input quantity cannot be negative'],
    },
    inputUnit: {
      type: String,
      enum: ['L', 'kg'],
      required: [true, 'Input unit is required'],
      default: 'L',
    },
    outputQuantity: {
      type: Number,
      required: [true, 'Output quantity is required'],
      min: [0, 'Output quantity cannot be negative'],
    },
    outputUnit: {
      type: String,
      enum: ['L', 'kg'],
      required: [true, 'Output unit is required'],
      default: 'L',
    },
    lossPercent: {
      type: Number,
      default: 0,
      min: [0, 'Loss percentage cannot be negative'],
      max: [100, 'Loss percentage cannot exceed 100'],
    },
    laborCost: {
      type: Number,
      required: [true, 'Labor cost is required'],
      min: [0, 'Labor cost cannot be negative'],
      default: 0,
    },
    energyCost: {
      type: Number,
      required: [true, 'Energy cost is required'],
      min: [0, 'Energy cost cannot be negative'],
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    costPerUnit: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Production date is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'On Hold'],
      default: 'Completed',
    },
    batchId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to calculate loss percentage and costs
 */
productionSchema.pre('save', function (next) {
  // Calculate loss percentage
  if (this.inputQuantity > 0) {
    this.lossPercent = parseFloat((((this.inputQuantity - this.outputQuantity) / this.inputQuantity) * 100).toFixed(2));
  }

  // Calculate total cost
  this.totalCost = this.laborCost + this.energyCost;

  // Calculate cost per unit
  if (this.outputQuantity > 0) {
    this.costPerUnit = parseFloat((this.totalCost / this.outputQuantity).toFixed(2));
  }

  // Generate batch ID if not provided
  if (!this.batchId) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.batchId = `${this.process.toUpperCase().slice(0, 3)}${date}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  next();
});

/** Index for efficient queries */
productionSchema.index({ process: 1 });
productionSchema.index({ date: -1 });
productionSchema.index({ status: 1 });
productionSchema.index({ date: -1, process: 1 });

const Production = mongoose.model('Production', productionSchema);

export default Production;
