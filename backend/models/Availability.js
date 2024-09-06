const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  scheduledSlots: [{
    start: Date,
    end: Date,
    attendees: [{ name: String, email: String }]
  }],
});

module.exports = mongoose.model('Availability', AvailabilitySchema);
