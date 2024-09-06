const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Create Availability
router.post('/create', async (req, res) => {
  try {
    const availability = new Availability(req.body);
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Availabilities for a User
router.get('/user/:userId', async (req, res) => {
  try {
    const availabilities = await Availability.find({ user: req.params.userId }).sort('start');
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Availability
router.put('/:id', async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(availability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Availability
router.delete('/:id', async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
