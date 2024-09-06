const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

router.post('/create', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const { user, start, end, duration, attendees } = req.body;
console.log(req.body);

    // Check for conflicts
    const conflicts = await Session.find({
      user,
      $or: [
        { start: { $lt: new Date(end), $gte: new Date(start) } },
        { end: { $gt: new Date(start), $lte: new Date(end) } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ error: 'Conflicting session exists' });
    }

    // Create session
    const session = new Session({
      user,
      start,
      end,
      duration,
      attendees
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// routes/sessions.js

router.put('/update/:id', async (req, res) => {
  try {
    const { start, end, attendees } = req.body;
    const session = await Session.findByIdAndUpdate(req.params.id, { start, end, attendees }, { new: true });
    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
