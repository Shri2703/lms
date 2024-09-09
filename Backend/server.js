const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

// Configuration
const app = express()
const PORT = 5000

const jwtSecret = 'secret123' // Replace with your actual secret

// MongoDB connection
const dbURI =
  'mongodb+srv://poornashri2703:envidoxlsm@cluster0.secnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1) // Exit process with failure
  })

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage: storage })

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
})

const User = mongoose.model('User', UserSchema)

// Register Route
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await user.save()

    res.status(201).json({ msg: 'User registered successfully' })
  } catch (err) {
    console.error('Error registering user:', err.message)
    res.status(500).send('Server Error')
  }
})

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user exists
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    }

    jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
      if (err) throw err
      res.json({ token, user: { name: user.name, role: user.role } }) // Include user data in the response
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).send('Server Error')
  }
})

// Middleware to verify the token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) // Use the same secret key as in your login function
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}

// Check Role Route
app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.json({ role: user.role })
  } catch (error) {
    console.error('Check role error:', error.message)
    res.status(500).json({ msg: 'Server error' })
  }
})

// File Model
const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
})

const File = mongoose.model('File', FileSchema)

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
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
  ],
})

const Course = mongoose.model('Course', CourseSchema)

// Module Model
const ModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
  mcqs: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswerIndex: {
        type: Number,
        required: true,
      },
    },
  ],
})

const Module = mongoose.model('Module', ModuleSchema)

// Create a course
app.post('/api/courses', async (req, res) => {
  try {
    const { title, description } = req.body
    const newCourse = new Course({ title, description })
    const course = await newCourse.save()
    res.status(201).json(course)
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// Get all courses
app.get('/api/allcourses', async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add a module to a course with file uploads
app.post(
  '/api/modules/:courseId',
  authMiddleware,
  upload.array('files'),
  async (req, res) => {
    try {
      const { courseId } = req.params
      const { name, description } = req.body

      if (!name || !description) {
        return res
          .status(400)
          .json({ msg: 'Name and description are required' })
      }

      const fileArray = []
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const newFile = new File({
            name: file.originalname,
            path: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            size: file.size,
          })
          const savedFile = await newFile.save()
          fileArray.push(savedFile._id) // Push the saved file's ID to the array
        }
      }

      const module = new Module({
        courseId,
        name,
        description,
        files: fileArray, // Store the array of file IDs in the module
      })
      await module.save()

      const course = await Course.findById(courseId)
      if (!course) return res.status(404).json({ msg: 'Course not found' })

      course.modules.push(module._id) // Add the module ID to the course's modules array
      await course.save()

      res.status(200).json(module)
    } catch (err) {
      console.error('Server error:', err)
      res.status(500).json({ msg: 'Server error', error: err.message })
    }
  }
)

// Fetching all modules with related data
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('courseId', 'title description')
      .populate('files')
      .exec()
    res.json(modules)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fetch all modules for a specific course
app.get('/api/modules/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params
    const modules = await Module.find({ courseId })
      .populate('files', 'name path')
      .exec()
    res.json(modules)
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ msg: 'Server error', error: err.message })
  }
})

// Add MCQ to a specific module
// Add MCQs to a module
// Example Express route for handling the POST request
// Add MCQs to a specific module
app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
  const { moduleId } = req.params
  const { mcqs } = req.body

  try {
    if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
      return res.status(400).json({ message: 'Invalid MCQ data provided' })
    }

    // Use the function to add MCQs to the module
    const updatedModule = await addMcqsToModule(moduleId, mcqs)

    res
      .status(201)
      .json({ message: 'MCQs added successfully', module: updatedModule })
  } catch (error) {
    console.error('Error adding MCQs:', error)
    res.status(500).json({ message: 'Server error. Please try again later.' })
  }
})

// Function to add MCQs to a module
const addMcqsToModule = async (moduleId, mcqs) => {
  try {
    // Find the module by its ID
    let module = await Module.findById(moduleId)

    if (!module) {
      throw new Error('Module not found')
    }

    // Add each MCQ to the module's mcqs array
    mcqs.forEach((mcq) => {
      module.mcqs.push(mcq)
    })

    // Save the updated module
    const updatedModule = await module.save()

    return updatedModule
  } catch (error) {
    console.error('Error adding MCQs to module:', error)
    throw error
  }
}

// Update an MCQ in a specific module
app.put(
  '/api/modules/:moduleId/mcqs/:mcqIndex',
  authMiddleware,
  async (req, res) => {
    try {
      const { moduleId, mcqIndex } = req.params
      const { question, options, correctAnswerIndex } = req.body

      // Find the module by ID
      const module = await Module.findById(moduleId)
      if (!module) {
        return res.status(404).json({ msg: 'Module not found' })
      }

      // Validate the mcqIndex
      if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
        return res.status(400).json({ msg: 'Invalid MCQ index' })
      }

      // Update the MCQ
      module.mcqs[mcqIndex] = { question, options, correctAnswerIndex }

      // Save the updated module
      await module.save()

      res.status(200).json({ msg: 'MCQ updated successfully', module })
    } catch (err) {
      console.error('Error updating MCQ:', err.message)
      res.status(500).json({ msg: 'Server error', error: err.message })
    }
  }
)

// Delete an MCQ from a specific module
app.delete(
  '/api/modules/:moduleId/mcqs/:mcqIndex',
  authMiddleware,
  async (req, res) => {
    try {
      const { moduleId, mcqIndex } = req.params

      // Find the module by ID
      const module = await Module.findById(moduleId)
      if (!module) {
        return res.status(404).json({ msg: 'Module not found' })
      }

      // Validate the mcqIndex
      if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
        return res.status(400).json({ msg: 'Invalid MCQ index' })
      }

      // Remove the MCQ from the array
      module.mcqs.splice(mcqIndex, 1)

      // Save the updated module
      await module.save()

      res.status(200).json({ msg: 'MCQ deleted successfully', module })
    } catch (err) {
      console.error('Error deleting MCQ:', err.message)
      res.status(500).json({ msg: 'Server error', error: err.message })
    }
  }
)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
