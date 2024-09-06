const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to create a new user (or log in if the user already exists)
router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({ email });
      await user.save();
    }

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
