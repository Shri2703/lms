const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuration
const app = express();
const PORT = 5000;
const jwtSecret = 'secret123'; // Replace with your actual secret

// MongoDB connection
const dbURI = 'mongodb+srv://poornashri2703:QQJpDHJJce4RcH1a@cluster0.yp4pylu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit process with failure
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User Model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate JWT token for user data
    const payload = { name, email, role };
    const token = jwt.sign(payload, jwtSecret);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully', token });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).send('Server Error');
  }
});

// Login Route
// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { name: user.name, role: user.role } }); // Include user data in the response
    });
    
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
