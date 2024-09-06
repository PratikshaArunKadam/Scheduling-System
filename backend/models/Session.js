const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  attendees: [{ name: String, email: String }], // Ensure this matches the expected format
});

module.exports = mongoose.model('Session', SessionSchema);
