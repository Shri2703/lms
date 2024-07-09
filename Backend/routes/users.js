// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // @route   POST api/users/register
// // @desc    Register a user
// // @access  Public
// router.post('/register', async (req, res) => {
//   const { name, email, role, password } = req.body;

//   try {
//     const user = new User({
//       name,
//       email,
//       role,
//       password,
//     });

//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.status(201).json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
