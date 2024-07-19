const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const router = express.Router();
 

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).send('Server Error');
  }
});

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
        name: user.name,
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

// Middleware to verify the token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // Use the same secret key as in your login function
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Check Role Route
app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ role: user.role });
  } catch (error) {
    console.error('Check role error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Course Model
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }]
});

const Course = mongoose.model('Course', CourseSchema);

// Module Model
const ModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  files: [{
    file: {
      type: String,
      required: true,
    },
  }],
  mcqs: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswerIndex: {
      type: Number,
      required: true
    }
  }]
});

const Module = mongoose.model('Module', ModuleSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create a course
app.post('/api/courses', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = new Course({ title, description });
    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/allcourses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a module to a course
app.post('/api/modules/:courseId', upload.array('files', 10), async (req, res) => {
  try {
    const { courseId } = req.params;
    const files = req.files.map(file => ({ file: file.path }));

    const module = new Module({ courseId, files });
    await module.save();

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.modules.push(module._id);
    await course.save();

    res.status(200).json(module);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/api/allcourses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add MCQs to a module
app.post('/api/modules/:courseId', upload.array('files', 10), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Files:', req.files);
    
    const { courseId } = req.params;
    const { name, description } = req.body;
    const files = req.files.map(file => ({ file: file.path }));

    const module = new Module({ courseId, name, description, files });
    await module.save();

    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found');
      return res.status(404).json({ msg: 'Course not found' });
    }

    course.modules.push(module._id);
    await course.save();

    res.status(200).json(module);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
