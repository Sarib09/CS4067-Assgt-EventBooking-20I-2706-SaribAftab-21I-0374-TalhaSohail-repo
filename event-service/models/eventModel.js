const mongoose = require('mongoose');

/**
 * Event Schema
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Conference', 'Workshop', 'Seminar', 'Concert', 'Exhibition', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Event price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalTickets: {
    type: Number,
    required: [true, 'Total number of tickets is required'],
    min: [1, 'Total tickets must be at least 1']
  },
  availableTickets: {
    type: Number,
    required: [true, 'Available tickets is required'],
    min: [0, 'Available tickets cannot be negative']
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required']
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a text index for search functionality
eventSchema.index({ title: 'text', description: 'text', location: 'text', category: 'text' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 