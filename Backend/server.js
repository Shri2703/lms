//old code
// const express = require('express')
// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const multer = require('multer')
// const path = require('path')

// // Configuration
// const app = express()
// const PORT = 5000

// const jwtSecret = 'secret123' // Replace with your actual secret

// // MongoDB connection
// const dbURI =
//   'mongodb+srv://poornashri2703:envidoxlsm@cluster0.secnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// mongoose
//   .connect(dbURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('MongoDB connected')
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err.message)
//     process.exit(1) // Exit process with failure
//   })

// // Middleware
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   },
// })

// const upload = multer({ storage: storage })

// // User Model
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   role: {
//     type: String,
//     enum: ['student', 'evaluator', 'admin'], // Ensure correct roles are defined
//     required: true,
//   },
// })

// const User = mongoose.model('User', UserSchema)

// // Register Route
// app.post('/api/users/register', async (req, res) => {
//   const { name, email, password, role } = req.body

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email })
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' })
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     })

//     await user.save()

//     res.status(201).json({ msg: 'User registered successfully' })
//   } catch (err) {
//     console.error('Error registering user:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' })
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' })
//     }

//     // Generate JWT token
//     const payload = {
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//       },
//     }

//     jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
//       if (err) throw err
//       res.json({ token, user: { name: user.name, role: user.role } }) // Include user data in the response
//     })
//   } catch (err) {
//     console.error('Login error:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// // Middleware to verify the token
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '')

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' })
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret) // Use the same secret key as in your login function
//     req.user = decoded.user
//     next()
//   } catch (error) {
//     res.status(401).json({ msg: 'Token is not valid' })
//   }
// }

// // Check Role Route
// app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id
//     const user = await User.findById(userId)

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' })
//     }

//     res.json({ role: user.role })
//   } catch (error) {
//     console.error('Check role error:', error.message)
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Fetch all students
// app.get('/api/users/students', async (req, res) => {
//   try {
//     const students = await User.find({ role: 'student' });
//     console.log('Fetched Students:', students);  // Log fetched students to the console
//     res.json(students);
//   } catch (err) {
//     console.error('Error fetching students:', err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Fetch all evaluators
// app.get('/api/users/evaluators', async (req, res) => {
//   try {
//     const evaluators = await User.find({ role: 'evaluator' });
//     console.log('Fetched Evaluators:', evaluators);  // Log fetched evaluators to the console
//     res.json(evaluators);
//   } catch (err) {
//     console.error('Error fetching evaluators:', err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // File Model
// const FileSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   path: {
//     type: String,
//     required: true,
//   },
//   fileType: {
//     type: String,
//     required: true,
//   },
//   size: {
//     type: Number,
//     required: true,
//   },
// })

// const File = mongoose.model('File', FileSchema)

// // Course Model
// const CourseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   modules: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Module',
//     },
//   ],
// })

// const Course = mongoose.model('Course', CourseSchema)

// // Module Model
// const ModuleSchema = new mongoose.Schema({
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   files: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'File',
//     },
//   ],
//   mcqs: [
//     {
//       question: {
//         type: String,
//         required: true,
//       },
//       options: [
//         {
//           type: String,
//           required: true,
//         },
//       ],
//       correctAnswerIndex: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
// })

// const Module = mongoose.model('Module', ModuleSchema)

// // Create a course
// app.post('/api/courses', async (req, res) => {
//   try {
//     const { title, description } = req.body
//     const newCourse = new Course({ title, description })
//     const course = await newCourse.save()
//     res.status(201).json(course)
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Get all courses
// app.get('/api/allcourses', async (req, res) => {
//   try {
//     const courses = await Course.find()
//     res.json(courses)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // Add a module to a course with file uploads
// app.post(
//   '/api/modules/:courseId',
//   authMiddleware,
//   upload.array('files'),
//   async (req, res) => {
//     try {
//       const { courseId } = req.params
//       const { name, description } = req.body

//       if (!name || !description) {
//         return res
//           .status(400)
//           .json({ msg: 'Name and description are required' })
//       }

//       const fileArray = []
//       if (req.files && req.files.length > 0) {
//         for (const file of req.files) {
//           const newFile = new File({
//             name: file.originalname,
//             path: `/uploads/${file.filename}`,
//             fileType: file.mimetype,
//             size: file.size,
//           })
//           const savedFile = await newFile.save()
//           fileArray.push(savedFile._id) // Push the saved file's ID to the array
//         }
//       }

//       const module = new Module({
//         courseId,
//         name,
//         description,
//         files: fileArray, // Store the array of file IDs in the module
//       })
//       await module.save()

//       const course = await Course.findById(courseId)
//       if (!course) return res.status(404).json({ msg: 'Course not found' })

//       course.modules.push(module._id) // Add the module ID to the course's modules array
//       await course.save()

//       res.status(200).json(module)
//     } catch (err) {
//       console.error('Server error:', err)
//       res.status(500).json({ msg: 'Server error', error: err.message })
//     }
//   }
// )

// // Fetching all modules with related data
// app.get('/api/modules', async (req, res) => {
//   try {
//     const modules = await Module.find()
//       .populate('courseId', 'title description')
//       .populate('files')
//       .exec()
//     res.json(modules)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // Fetch all modules for a specific course
// app.get('/api/modules/:courseId', async (req, res) => {
//   try {
//     const { courseId } = req.params
//     const modules = await Module.find({ courseId })
//       .populate('files', 'name path')
//       .exec()
//     res.json(modules)
//   } catch (err) {
//     console.error('Server error:', err)
//     res.status(500).json({ msg: 'Server error', error: err.message })
//   }
// })

// // Update a course by ID
// app.put('/api/courses/:id', async (req, res) => {
//   const { id } = req.params
//   const { title, description } = req.body

//   try {
//     const updatedCourse = await Course.findByIdAndUpdate(
//       id,
//       { title, description },
//       { new: true, runValidators: true }
//     )

//     if (!updatedCourse) {
//       return res.status(404).json({ msg: 'Course not found' })
//     }

//     res.json(updatedCourse)
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Delete a course by ID
// app.delete('/api/courses/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const deletedCourse = await Course.findByIdAndDelete(id)

//     if (!deletedCourse) {
//       return res.status(404).json({ msg: 'Course not found' })
//     }

//     res.json({ msg: 'Course deleted successfully' })
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Add MCQ to a specific module
// // Add MCQs to a module
// // Example Express route for handling the POST request
// // Add MCQs to a specific module
// app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
//   const { moduleId } = req.params
//   const { mcqs } = req.body

//   try {
//     if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
//       return res.status(400).json({ message: 'Invalid MCQ data provided' })
//     }

//     // Use the function to add MCQs to the module
//     const updatedModule = await addMcqsToModule(moduleId, mcqs)

//     res
//       .status(201)
//       .json({ message: 'MCQs added successfully', module: updatedModule })
//   } catch (error) {
//     console.error('Error adding MCQs:', error)
//     res.status(500).json({ message: 'Server error. Please try again later.' })
//   }
// })

// // Function to add MCQs to a module
// const addMcqsToModule = async (moduleId, mcqs) => {
//   try {
//     // Find the module by its ID
//     let module = await Module.findById(moduleId)

//     if (!module) {
//       throw new Error('Module not found')
//     }

//     // Add each MCQ to the module's mcqs array
//     mcqs.forEach((mcq) => {
//       module.mcqs.push(mcq)
//     })

//     // Save the updated module
//     const updatedModule = await module.save()

//     return updatedModule
//   } catch (error) {
//     console.error('Error adding MCQs to module:', error)
//     throw error
//   }
// }

// // Update an MCQ in a specific module
// app.put(
//   '/api/modules/:moduleId/mcqs/:mcqIndex',
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const { moduleId, mcqIndex } = req.params
//       const { question, options, correctAnswerIndex } = req.body

//       // Find the module by ID
//       const module = await Module.findById(moduleId)
//       if (!module) {
//         return res.status(404).json({ msg: 'Module not found' })
//       }

//       // Validate the mcqIndex
//       if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
//         return res.status(400).json({ msg: 'Invalid MCQ index' })
//       }

//       // Update the MCQ
//       module.mcqs[mcqIndex] = { question, options, correctAnswerIndex }

//       // Save the updated module
//       await module.save()

//       res.status(200).json({ msg: 'MCQ updated successfully', module })
//     } catch (err) {
//       console.error('Error updating MCQ:', err.message)
//       res.status(500).json({ msg: 'Server error', error: err.message })
//     }
//   }
// )

// // Delete an MCQ from a specific module
// // Delete an MCQ from a specific module
// app.delete(
//   '/api/modules/:moduleId/mcqs/:mcqIndex',
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const { moduleId, mcqIndex } = req.params;

//       // Find the module by ID
//       const module = await Module.findById(moduleId);
//       if (!module) {
//         return res.status(404).json({ msg: 'Module not found' });
//       }

//       // Validate the mcqIndex
//       if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
//         return res.status(400).json({ msg: 'Invalid MCQ index' });
//       }

//       // Remove the MCQ from the module's mcqs array
//       module.mcqs.splice(mcqIndex, 1);

//       // Save the updated module
//       await module.save();

//       res.status(200).json({ msg: 'MCQ deleted successfully', module });
//     } catch (err) {
//       console.error('Error deleting MCQ:', err.message);
//       res.status(500).json({ msg: 'Server error', error: err.message });
//     }
//   }
// );

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

//old perfect code
// const express = require('express')
// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const multer = require('multer')
// const path = require('path')

// // Configuration
// const app = express()
// const PORT = 5000

// const jwtSecret = 'secret123' // Replace with your actual secret

// // MongoDB connection
// const dbURI =
//   'mongodb+srv://poornashri2703:envidoxlsm@cluster0.secnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// mongoose
//   .connect(dbURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('MongoDB connected')
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err.message)
//     process.exit(1) // Exit process with failure
//   })

// // Middleware
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, 'uploads'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   },
// })

// const upload = multer({ storage: storage })

// // User Model
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     required: true,
//     enum: ['admin', 'student', 'evaluator'], // Specify possible roles
//   },
//   courseIds: {
//     type: [mongoose.Schema.Types.ObjectId], // Store an array of ObjectIds referencing the courses
//     ref: 'Course',
//     default: [], // Initialize as an empty array
//   },
// })

// const User = mongoose.model('User', UserSchema)

// // Register Route
// app.post('/api/users/register', async (req, res) => {
//   const { name, email, password, role,

//    } = req.body

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email })
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' })
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     })

//     await user.save()

//     res.status(201).json({ msg: 'User registered successfully' })
//   } catch (err) {
//     console.error('Error registering user:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' })
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' })
//     }

//     // Generate JWT token
//     const payload = {
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//       },
//     }

//     jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
//       if (err) throw err
//       res.json({ token, user: { name: user.name, role: user.role } }) // Include user data in the response
//     })
//   } catch (err) {
//     console.error('Login error:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// // Middleware to verify the token
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '')

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' })
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret) // Use the same secret key as in your login function
//     req.user = decoded.user
//     next()
//   } catch (error) {
//     res.status(401).json({ msg: 'Token is not valid' })
//   }
// }

// // Check Role Route
// app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id
//     const user = await User.findById(userId)

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' })
//     }

//     res.json({ role: user.role })
//   } catch (error) {
//     console.error('Check role error:', error.message)
//     res.status(500).json({ msg: 'Server error' })
//   }
// })
// app.get('/api/users/students', async (req, res) => {
//   try {
//     const students = await User.find({ role: 'student' })
//     console.log('Fetched Students:', students) // Log fetched students
//     res.json(students)
//   } catch (err) {
//     console.error('Error fetching students:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// app.get('/api/users/evaluators', async (req, res) => {
//   try {
//     const evaluators = await User.find({ role: 'evaluator' })
//     console.log('Fetched Evaluators:', evaluators) // Log fetched evaluators
//     res.json(evaluators)
//   } catch (err) {
//     console.error('Error fetching evaluators:', err.message)
//     res.status(500).send('Server Error')
//   }
// })

// // File Model
// const FileSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   path: {
//     type: String,
//     required: true,
//   },
//   fileType: {
//     type: String,
//     required: true,
//   },
//   size: {
//     type: Number,
//     required: true,
//   },
// })

// const File = mongoose.model('File', FileSchema)

// // Course Model
// const CourseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   modules: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Module',
//     },
//   ],
// })

// const Course = mongoose.model('Course', CourseSchema)

// // Module Model
// const ModuleSchema = new mongoose.Schema({
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   files: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'File',
//     },
//   ],
//   mcqs: [
//     {
//       question: {
//         type: String,
//         required: true,
//       },
//       options: [
//         {
//           type: String,
//           required: true,
//         },
//       ],
//       correctAnswerIndex: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
// })

// const Module = mongoose.model('Module', ModuleSchema)

// // Create a course
// app.post('/api/courses', async (req, res) => {
//   try {
//     const { title, description } = req.body
//     const newCourse = new Course({ title, description })
//     const course = await newCourse.save()
//     res.status(201).json(course)
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Get all courses
// app.get('/api/allcourses', async (req, res) => {
//   try {
//     const courses = await Course.find()
//     res.json(courses)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // Add a module to a course with file uploads
// app.post(
//   '/api/modules/:courseId',
//   authMiddleware,
//   upload.array('files'),
//   async (req, res) => {
//     try {
//       const { courseId } = req.params
//       const { name, description } = req.body

//       if (!name || !description) {
//         return res
//           .status(400)
//           .json({ msg: 'Name and description are required' })
//       }

//       const fileArray = []
//       if (req.files && req.files.length > 0) {
//         for (const file of req.files) {
//           const newFile = new File({
//             name: file.originalname,
//             path: `/uploads/${file.filename}`,
//             fileType: file.mimetype,
//             size: file.size,
//           })
//           const savedFile = await newFile.save()
//           fileArray.push(savedFile._id) // Push the saved file's ID to the array
//         }
//       }

//       const module = new Module({
//         courseId,
//         name,
//         description,
//         files: fileArray, // Store the array of file IDs in the module
//       })
//       await module.save()

//       const course = await Course.findById(courseId)
//       if (!course) return res.status(404).json({ msg: 'Course not found' })

//       course.modules.push(module._id) // Add the module ID to the course's modules array
//       await course.save()

//       res.status(200).json(module)
//     } catch (err) {
//       console.error('Server error:', err)
//       res.status(500).json({ msg: 'Server error', error: err.message })
//     }
//   }
// )

// // Fetching all modules with related data
// app.get('/api/modules', async (req, res) => {
//   try {
//     const modules = await Module.find()
//       .populate('courseId', 'title description')
//       .populate('files')
//       .exec()
//     res.json(modules)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // Fetch all modules for a specific course
// app.get('/api/modules/:courseId', async (req, res) => {
//   try {
//     const { courseId } = req.params
//     const modules = await Module.find({ courseId })
//       .populate('files', 'name path')
//       .exec()
//     res.json(modules)
//   } catch (err) {
//     console.error('Server error:', err)
//     res.status(500).json({ msg: 'Server error', error: err.message })
//   }
// })

// // Update a course by ID
// app.put('/api/courses/:id', async (req, res) => {
//   const { id } = req.params
//   const { title, description } = req.body

//   try {
//     const updatedCourse = await Course.findByIdAndUpdate(
//       id,
//       { title, description },
//       { new: true, runValidators: true }
//     )

//     if (!updatedCourse) {
//       return res.status(404).json({ msg: 'Course not found' })
//     }

//     res.json(updatedCourse)
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Delete a course by ID
// app.delete('/api/courses/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const deletedCourse = await Course.findByIdAndDelete(id)

//     if (!deletedCourse) {
//       return res.status(404).json({ msg: 'Course not found' })
//     }

//     res.json({ msg: 'Course deleted successfully' })
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' })
//   }
// })

// // Add MCQ to a specific module
// // Add MCQs to a module
// // Example Express route for handling the POST request
// // Add MCQs to a specific module
// app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
//   const { moduleId } = req.params
//   const { mcqs } = req.body

//   try {
//     if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
//       return res.status(400).json({ message: 'Invalid MCQ data provided' })
//     }

//     // Use the function to add MCQs to the module
//     const updatedModule = await addMcqsToModule(moduleId, mcqs)

//     res
//       .status(201)
//       .json({ message: 'MCQs added successfully', module: updatedModule })
//   } catch (error) {
//     console.error('Error adding MCQs:', error)
//     res.status(500).json({ message: 'Server error. Please try again later.' })
//   }
// })

// // Function to add MCQs to a module
// const addMcqsToModule = async (moduleId, mcqs) => {
//   try {
//     // Find the module by its ID
//     let module = await Module.findById(moduleId)

//     if (!module) {
//       throw new Error('Module not found')
//     }

//     // Add each MCQ to the module's mcqs array
//     mcqs.forEach((mcq) => {
//       module.mcqs.push(mcq)
//     })

//     // Save the updated module
//     const updatedModule = await module.save()

//     return updatedModule
//   } catch (error) {
//     console.error('Error adding MCQs to module:', error)
//     throw error
//   }
// }

// // Update an MCQ in a specific module
// app.put(
//   '/api/modules/:moduleId/mcqs/:mcqIndex',
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const { moduleId, mcqIndex } = req.params
//       const { question, options, correctAnswerIndex } = req.body

//       // Find the module by ID
//       const module = await Module.findById(moduleId)
//       if (!module) {
//         return res.status(404).json({ msg: 'Module not found' })
//       }

//       // Validate the mcqIndex
//       if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
//         return res.status(400).json({ msg: 'Invalid MCQ index' })
//       }

//       // Update the MCQ
//       module.mcqs[mcqIndex] = { question, options, correctAnswerIndex }

//       // Save the updated module
//       await module.save()

//       res.status(200).json({ msg: 'MCQ updated successfully', module })
//     } catch (err) {
//       console.error('Error updating MCQ:', err.message)
//       res.status(500).json({ msg: 'Server error', error: err.message })
//     }
//   }
// )

// // Delete an MCQ from a specific module
// // Delete an MCQ from a specific module
// app.delete(
//   '/api/modules/:moduleId/mcqs/:mcqIndex',
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const { moduleId, mcqIndex } = req.params

//       // Find the module by ID
//       const module = await Module.findById(moduleId)
//       if (!module) {
//         return res.status(404).json({ msg: 'Module not found' })
//       }

//       // Validate the mcqIndex
//       if (mcqIndex < 0 || mcqIndex >= module.mcqs.length) {
//         return res.status(400).json({ msg: 'Invalid MCQ index' })
//       }

//       // Remove the MCQ from the module's mcqs array
//       module.mcqs.splice(mcqIndex, 1)

//       // Save the updated module
//       await module.save()

//       res.status(200).json({ msg: 'MCQ deleted successfully', module })
//     } catch (err) {
//       console.error('Error deleting MCQ:', err.message)
//       res.status(500).json({ msg: 'Server error', error: err.message })
//     }
//   }
// )

// // Get all evaluators
// app.get('/api/evaluators', async (req, res) => {
//   try {
//     const evaluators = await User.find({ role: 'evaluator' });
//     res.status(200).json(evaluators);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching evaluators', error });
//   }
// });

// // Get all courses
// app.get('/api/courses', async (req, res) => {
//   try {
//     const courses = await Course.find(); // Replace `Course` with your actual model name
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching courses', error });
//   }
// });

// // Assign course to evaluator
// // POST route for assigning a course to an evaluator or student
// app.post('/api/evaluators/assign-course', async (req, res) => {
//   const { evaluatorId, courseId } = req.body;

//   try {
//     // Find the evaluator or student by ID
//     const evaluator = await User.findById(evaluatorId);

//     if (!evaluator) {
//       return res.status(404).json({ message: 'Evaluator not found' });
//     }

//     // Check if the courseId is already in the courseIds array
//     if (!evaluator.courseIds.includes(courseId)) {
//       // Add the course ID to the user's courseIds array
//       evaluator.courseIds.push(courseId);
//       await evaluator.save();
//     }

//     res.status(200).json({ message: 'Course assigned successfully', evaluator });
//   } catch (error) {
//     console.error('Error while assigning course:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// app.use(express.json());

// const jwtSecret = 'secret123';

// // Database connection
// mongoose.connect('mongodb+srv://envidox:lms_backend@cluster0.ngrck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('MongoDB connected');
// });

// // Schemas
// const FileSchema = new mongoose.Schema({
//   name: String,
//   path: String,
//   fileType: String,
//   size: Number,
// });

// const ModuleSchema = new mongoose.Schema({
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
//   mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
// });

// const MCQSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: { type: [String], required: true },
//   correctAnswer: { type: String, required: true },
//   moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
// });

// const CourseSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
// });

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'evaluator', 'student'], default: 'student' },
// });

// const File = mongoose.model('File', FileSchema);
// const Module = mongoose.model('Module', ModuleSchema);
// const Course = mongoose.model('Course', CourseSchema);
// const User = mongoose.model('User', UserSchema);
// const MCQ = mongoose.model('MCQ', MCQSchema);

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// // Routes

// /** User Registration */
// app.post('/api/users/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// /** User Login */
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = { user: { id: user.id, name: user.name, role: user.role } };

//     jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token, user: { name: user.name, role: user.role } });
//     });
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// /** Course Management */
// // Get all courses
// app.get('/api/courses', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json({ success: true, courses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Get a specific course by ID
// app.get('/api/courses/:courseId', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId).populate('modules');
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Create a new course
// app.post('/api/courses', async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const course = new Course({ title, description });
//     await course.save();
//     res.status(201).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update a course
// app.put('/api/courses/:courseId', async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const course = await Course.findByIdAndUpdate(req.params.courseId, { title, description }, { new: true });
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete a course
// app.delete('/api/courses/:courseId', async (req, res) => {
//   try {
//     const course = await Course.findByIdAndDelete(req.params.courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, message: 'Course deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });
// // Get all modules for a course
// app.get('/api/courses/:courseId/modules', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId).populate('modules');
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, modules: course.modules });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Add a module to a course
// app.post('/api/courses/:courseId/modules', upload.array('files'), async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { name, description } = req.body;

//     const files = await Promise.all(req.files.map(async (file) => {
//       const newFile = new File({
//         name: file.originalname,
//         path: `/uploads/${file.filename}`,
//         fileType: file.mimetype,
//         size: file.size,
//       });
//       return await newFile.save();
//     }));

//     const module = new Module({
//       courseId,
//       name,
//       description,
//       files: files.map(file => file._id),
//     });

//     const savedModule = await module.save();

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

//     course.modules.push(savedModule._id);
//     await course.save();

//     res.status(201).json({ success: true, module: savedModule });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update a module
// app.put('/api/modules/:moduleId', async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const module = await Module.findByIdAndUpdate(req.params.moduleId, { name, description }, { new: true });
//     if (!module) {
//       return res.status(404).json({ success: false, message: 'Module not found' });
//     }
//     res.status(200).json({ success: true, module });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete a module
// app.delete('/api/modules/:moduleId', async (req, res) => {
//   try {
//     const module = await Module.findByIdAndDelete(req.params.moduleId);
//     if (!module) {
//       return res.status(404).json({ success: false, message: 'Module not found' });
//     }
//     res.status(200).json({ success: true, message: 'Module deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });
// // Add MCQs to a module
// app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
//   try {
//     const { mcqs } = req.body;
//     const { moduleId } = req.params;

//     if (!Array.isArray(mcqs) || mcqs.length === 0) {
//       return res.status(400).json({ success: false, message: 'Invalid MCQs data' });
//     }

//     const savedMCQs = await MCQ.insertMany(mcqs.map(mcq => ({ ...mcq, moduleId })));

//     const module = await Module.findById(moduleId);
//     if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

//     module.mcqs.push(...savedMCQs.map(mcq => mcq._id));
//     await module.save();

//     res.status(201).json({ success: true, mcqs: savedMCQs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update an MCQ
// app.put('/api/mcqs/:mcqId', async (req, res) => {
//   try {
//     const { question, options, correctAnswer } = req.body;
//     const mcq = await MCQ.findByIdAndUpdate(
//       req.params.mcqId,
//       { question, options, correctAnswer },
//       { new: true }
//     );
//     if (!mcq) return res.status(404).json({ success: false, message: 'MCQ not found' });

//     res.status(200).json({ success: true, mcq });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete an MCQ
// app.delete('/api/mcqs/:mcqId', async (req, res) => {
//   try {
//     const mcq = await MCQ.findByIdAndDelete(req.params.mcqId);
//     if (!mcq) return res.status(404).json({ success: false, message: 'MCQ not found' });

//     res.status(200).json({ success: true, message: 'MCQ deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

//poori updated code
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const csv = require('csv-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')



const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const jwtSecret = 'secret123'

// Database connection
mongoose.connect(
  'mongodb+srv://envidox:lms_backend@cluster0.ngrck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('MongoDB connected')
})

// Schemas
const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  fileType: { type: String, required: true }, // Example: 'pdf', 'doc', etc.
  size: { type: Number, required: true }, // Size in bytes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who uploaded the file
  uploadDate: { type: Date, default: Date.now },
})

// MCQ Schema
const MCQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
})

// Module Schema
const ModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
  progress: {
    type: Map, // User-specific progress tracking
    of: Number, // Progress percentage (0-100)
    default: {},
  },
})

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  progress: {
    type: Map, // User-specific progress tracking
    of: Number, // Progress percentage (0-100)
    default: {},
  },
  completionStatus: {
    type: Map, // User-specific course completion tracking
    of: Boolean, // true if completed
    default: {},
  },
})

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'evaluator', 'student'],
    default: 'student',
  },
})

// New Schemas
const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      progress: { type: Number, default: 0, min: 0, max: 100 },
      status: {
        type: String,
        enum: ['assigned', 'completed', 'pending'],
        default: 'assigned',
      },
      startDate: { type: Date, default: Date.now }, // When the course was assigned
      endDate: { type: Date, default: null }, // When the course was completed
      lastUpdated: { type: Date, default: Date.now }, // Tracks progress updates
      certification: {
        type: String, // URL or file path of the certificate
        default: null,
      },
    },
  ],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Optional
  pendingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Optional
})

const EvaluatorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  verifiedAssessments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  ],
  approvedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
})

const AdminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

const AssignmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  file: {
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'completed'],
    default: 'submitted',
  },
  submittedAt: { type: Date, default: Date.now },
})

// Models
const File = mongoose.model('File', FileSchema)
const Module = mongoose.model('Module', ModuleSchema)
const Course = mongoose.model('Course', CourseSchema)
const User = mongoose.model('User', UserSchema)
const MCQ = mongoose.model('MCQ', MCQSchema)
const Student = mongoose.model('Student', StudentSchema)
const Evaluator = mongoose.model('Evaluator', EvaluatorSchema)
const Admin = mongoose.model('Admin', AdminSchema)
const Assignment = mongoose.model('Assignment', AssignmentSchema)

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype.startsWith('image/')
    ) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type'), false)
    }
  },
})


// Routes
// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}

// Routes

/** User Registration */
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user = new User({ name, email, password: hashedPassword, role })
    await user.save()

    res.status(201).json({ msg: 'User registered successfully' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

//bulk student register
app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
  try {
    // Ensure user ID is present in the token
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({ msg: 'Invalid token data' })
    }

    // Fetch the user from the database
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // Return the user's role
    res.json({ role: user.role })
  } catch (error) {
    console.error('Check role error:', error.message)
    res.status(500).json({ msg: 'Server error' })
  }
})

/** User Login */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    const payload = { user: { id: user.id, name: user.name, role: user.role } }

    jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
      if (err) throw err
      res.json({ token, user: { name: user.name, role: user.role } })
    })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

app.get('/api/auth/checkRole', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id // Extract user ID from the token
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

app.post('/api/students', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({ name, email, password: hashedPassword })

    // Create student
    const student = await Student.create({ userId: user._id })

    res.status(201).json({ message: 'Student created successfully', student })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating student: ${error.message}` })
  }
})

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find()
    .populate('userId')
    .populate('assignedCourses')
    res.status(200).json({ students })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching students: ${error.message}` })
  }
})

// Route: GET /api/students/user/:userId
app.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { id } = req.params

    // Find the student associated with the provided user ID
    const student = await Student.findOne({ userId: id })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Return the student data
    res.json(student)
  } catch (error) {
    console.error('Error fetching student data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
})


// Get a single student
app.get('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params

    // Find the student by their ID
    const student = await Student.findById(studentId).populate(
      'assignedCourses.courseId'
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({ student })
  } catch (error) {
    console.error('Error fetching student data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update a student
app.put('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params
    const { name, email } = req.body

    const student = await Student.findById(studentId).populate('userId')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const user = await User.findById(student.userId)
    if (name) user.name = name
    if (email) user.email = email
    await user.save()

    res.status(200).json({ message: 'Student updated successfully', student })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating student: ${error.message}` })
  }
})

// Delete a student
app.delete('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params

    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    await User.findByIdAndDelete(student.userId)
    await student.delete()

    res.status(200).json({ message: 'Student deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting student: ${error.message}` })
  }
})

// Assign courses to a student
app.post('/api/students/:studentId/assign-course', async (req, res) => {
  const { studentId } = req.params
  const { courseId } = req.body

  try {
    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' })
    }

    // Check if the course is already assigned
    const isAlreadyAssigned = student.assignedCourses.some(
      (course) => course.courseId.toString() === courseId
    )
    if (isAlreadyAssigned) {
      return res.status(400).json({ msg: 'Course already assigned' })
    }

    // Add the course with initial details
    student.assignedCourses.push({
      courseId,
      progress: 0,
      status: 'assigned',
      startDate: new Date(),
      lastUpdated: new Date(),
    })

    await student.save()
    res.status(200).json({ msg: 'Course assigned successfully', student })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
//update progress of student

app.put('/api/students/:studentId/update-progress', async (req, res) => {
  const { studentId } = req.params
  const { courseId, progress, status } = req.body

  try {
    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' })
    }

    // Find the course in assignedCourses
    const course = student.assignedCourses.find(
      (c) => c.courseId.toString() === courseId
    )
    if (!course) {
      return res.status(404).json({ msg: 'Course not assigned to the student' })
    }

    // Update the course details
    course.progress = progress
    course.status = status || course.status
    course.lastUpdated = new Date()

    if (status === 'completed') {
      course.endDate = new Date()
    }

    await student.save()
    res.status(200).json({ msg: 'Progress updated successfully', student })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
// completed course by student
app.get('/api/students/:studentId/completed-courses', async (req, res) => {
  const { studentId } = req.params

  try {
    const student = await Student.findById(studentId).populate(
      'assignedCourses.courseId'
    )
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' })
    }

    const completedCourses = student.assignedCourses.filter(
      (course) => course.status === 'completed'
    )

    res.status(200).json(completedCourses)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//unasign the course to student
app.delete('/api/students/:studentId/unassign-course', async (req, res) => {
  const { studentId } = req.params
  const { courseId } = req.body

  try {
    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' })
    }

    student.assignedCourses = student.assignedCourses.filter(
      (course) => course.courseId.toString() !== courseId
    )

    await student.save()
    res.status(200).json({ msg: 'Course unassigned successfully', student })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
//assignment upload 
app.post(
  '/api/students/:studentId/submit-assignment',
  upload.single('assignmentFile'),
  async (req, res) => {
    const { studentId } = req.params
    const { courseId, moduleId } = req.body

    try {
      // Validate the uploaded file
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' })
      }

      // Move forward with your database logic
      res.status(200).json({
        msg: 'Assignment uploaded successfully',
        file: req.file,
      })
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

app.get('/evaluator/:id', authMiddleware, async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const { id } = req.params

    // Find the evaluator associated with the provided user ID
    const evaluator = await Evaluator.findOne({ userId: id })

    if (!evaluator) {
      return res.status(404).json({ message: 'Evaluator not found' })
    }

    // Return the evaluator data
    res.json(evaluator)
  } catch (error) {
    console.error('Error fetching evaluator data:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
})



// Create Evaluator
app.post('/api/evaluator', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'evaluator',
    })

    const evaluator = await Evaluator.create({ userId: user._id })

    res
      .status(201)
      .json({ message: 'Evaluator created successfully', evaluator })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get All Evaluators
app.get('/api/evaluators', async (req, res) => {
  try {
    const evaluators = await Evaluator.find()
      .populate('userId')
      .populate('assignedCourses')
    res.status(200).json(evaluators)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get Evaluator by ID
app.get('/api/evaluator/:id', async (req, res) => {
  try {
    const evaluator = await Evaluator.findById(req.params.id)
      .populate('userId')
      .populate('assignedCourses')
    if (!evaluator)
      return res.status(404).json({ message: 'Evaluator not found' })
    res.status(200).json(evaluator)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update Evaluator
app.put('/api/evaluator/:id', async (req, res) => {
  try {
    const { assignedCourses, verifiedAssessments, approvedStudents } = req.body

    const evaluator = await Evaluator.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedCourses, verifiedAssessments, approvedStudents } },
      { new: true }
    )

    if (!evaluator)
      return res.status(404).json({ message: 'Evaluator not found' })

    res
      .status(200)
      .json({ message: 'Evaluator updated successfully', evaluator })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete Evaluator
app.delete('/api/evaluator/:id', async (req, res) => {
  try {
    const evaluator = await Evaluator.findByIdAndDelete(req.params.id)
    if (!evaluator)
      return res.status(404).json({ message: 'Evaluator not found' })

    await User.findByIdAndDelete(evaluator.userId)

    res.status(200).json({ message: 'Evaluator deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Assign Course to Evaluator
app.post('/api/evaluators/assign-courses/:evaluatorId', async (req, res) => {
  try {
    const { evaluatorId } = req.params
    const { courseIds } = req.body

    // Validate input
    if (!courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({ message: 'Invalid courseIds array.' })
    }

    // Check if evaluator exists
    const evaluator = await Evaluator.findById(evaluatorId)
    if (!evaluator) {
      return res.status(404).json({ message: 'Evaluator not found.' })
    }

    // Verify all course IDs
    const courses = await Course.find({ _id: { $in: courseIds } })
    if (courses.length !== courseIds.length) {
      return res.status(404).json({ message: 'Some courses not found.' })
    }

    // Assign courses to the evaluator
    evaluator.assignedCourses = [
      ...new Set([...evaluator.assignedCourses, ...courseIds]),
    ]
    await evaluator.save()

    res
      .status(200)
      .json({ message: 'Courses assigned successfully.', evaluator })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error assigning courses.', error: error.message })
  }
})
//unasign the course to the evalutor
app.delete('/api/evaluators/:evaluatorId/unassign-course', async (req, res) => {
  const { evaluatorId } = req.params
  const { courseId } = req.body

  try {
    const evaluator = await Evaluator.findById(evaluatorId)
    if (!evaluator) {
      return res.status(404).json({ msg: 'Evaluator not found' })
    }

    // Remove the course from assignedCourses
    evaluator.assignedCourses = evaluator.assignedCourses.filter(
      (course) => course.toString() !== courseId
    )

    await evaluator.save()
    res.status(200).json({ msg: 'Course unassigned successfully', evaluator })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
//to get course studend undert the evaluator
app.get(
  '/api/evaluators/:evaluatorId/courses/:courseId/students',
  async (req, res) => {
    try {
      const { evaluatorId, courseId } = req.params

      // Verify evaluator exists
      const evaluator = await Evaluator.findById(evaluatorId)
      if (!evaluator) {
        return res.status(404).json({ message: 'Evaluator not found.' })
      }

      // Check if the evaluator is assigned to this course
      if (!evaluator.assignedCourses.includes(courseId)) {
        return res
          .status(403)
          .json({ message: 'Evaluator is not assigned to this course.' })
      }

      // Find all students assigned to this course
      const students = await Student.find({
        'assignedCourses.courseId': courseId,
      }).populate('userId', 'name email') // Populate user info (name and email)

      // Return the list of students
      res.status(200).json({
        message: 'Students in the course retrieved successfully.',
        students,
      })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'Error fetching students.', error: error.message })
    }
  }
)

/** Course Management */
// Get all courses
app.get('/api/allcourses', async (req, res) => {
  try {
    const courses = await Course.find()
    res.status(200).json({ success: true, courses })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Get a specific course by ID
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      'modules'
    )
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }
    res.status(200).json({ success: true, course })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Create a new course
app.post('/api/courses', async (req, res) => {
  try {
    const { title, description } = req.body
    const course = new Course({ title, description })
    await course.save()
    res.status(201).json({ success: true, course })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Update a course
app.put('/api/courses/:courseId', async (req, res) => {
  try {
    const { title, description } = req.body
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { title, description },
      { new: true }
    )
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }
    res.status(200).json({ success: true, course })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Delete a course
app.delete('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId)
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'Course deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})
// Get all modules for a course
app
  .get('/api/courses/:courseId/modules', async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId).populate(
        'modules'
      )
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: 'Course not found' })
      }
      res.status(200).json({ success: true, modules: course.modules })
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Server error', error: err.message })
    }
  })

  app.post(
    '/courses/:courseId/modules',
    upload.array('files'),
    async (req, res) => {
      try {
        const { courseId } = req.params
        const { name, description } = req.body

        const files = req.files.map((file) => ({
          name: file.originalname,
          path: file.path,
        }))

        const newModule = new Module({
          courseId,
          name,
          description,
          files,
        })

        await newModule.save()
        res.status(201).json({ success: true, module: newModule })
      } catch (error) {
        console.error('Error creating module:', error)
        res
          .status(500)
          .json({ success: false, error: 'Failed to create module' })
      }
    }
  )




// Update a module
app.put('/api/modules/:moduleId', async (req, res) => {
  try {
    const { name, description, files } = req.body // Destructure files from the request body

    const module = await Module.findByIdAndUpdate(
      req.params.moduleId,
      { name, description, files }, // Include files in the update
      { new: true }
    )

    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: 'Module not found' })
    }

    res.status(200).json({ success: true, module })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})


// Delete a module
app
  .delete('/api/modules/:moduleId', async (req, res) => {
    try {
      const module = await Module.findByIdAndDelete(req.params.moduleId)
      if (!module) {
        return res
          .status(404)
          .json({ success: false, message: 'Module not found' })
      }
      res
        .status(200)
        .json({ success: true, message: 'Module deleted successfully' })
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Server error', error: err.message })
    }
  })

  app.get('/modules/files', async (req, res) => {
    try {
      const modules = await Module.find().select('name description files') // Fetching only necessary fields
      res.status(200).json({ success: true, modules })
    } catch (error) {
      console.error('Error fetching modules with files:', error)
      res
        .status(500)
        .json({ success: false, error: 'Failed to fetch modules and files' })
    }
  })


  
app.get('/:id', async (req, res) => {
  try {
    const fileId = req.params.id

    // Find the file by ID
    const file = await File.findById(fileId)

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' })
    }

    res.status(200).json({ success: true, file })
  } catch (err) {
    console.error('Error fetching file:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file',
      error: err.message,
    })
  }
})


app
  .get('/:moduleId/mcqs', async (req, res) => {
    try {
      const module = await Module.findById(req.params.moduleId).select('mcqs')
      if (!module) {
        return res
          .status(404)
          .json({ success: false, message: 'Module not found' })
      }
      res.status(200).json({ success: true, mcqs: module.mcqs })
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: 'Server error', error: err.message })
    }
  })

  app
    .post('/:moduleId/mcqs/submit', async (req, res) => {
      try {
        const { answers } = req.body
        const module = await Module.findById(req.params.moduleId).select('mcqs')
        if (!module) {
          return res
            .status(404)
            .json({ success: false, message: 'Module not found' })
        }

        const { mcqs } = module
        let score = 0

        mcqs.forEach((mcq, index) => {
          if (answers[index] === mcq.correctAnswer) {
            score += 1
          }
        })

        res.status(200).json({ success: true, score })
      } catch (err) {
        res
          .status(500)
          .json({ success: false, message: 'Server error', error: err.message })
      }
  })

    
app.get('/mcq/:id', async (req, res) => {
  const { id } = req.params

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid MCQ ID.' })
  }

  try {
    // Find the MCQ by ID
    const mcq = await Mcq.findById(id)
    if (!mcq) {
      return res.status(404).json({ success: false, message: 'MCQ not found.' })
    }

    // Send the MCQ data
    res.status(200).json({ success: true, mcq })
  } catch (error) {
    console.error('Error fetching MCQ:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

// Add MCQs to a module
app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
  try {
    const { mcqs } = req.body
    const { moduleId } = req.params

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid MCQs data' })
    }

    const savedMCQs = await MCQ.insertMany(
      mcqs.map((mcq) => ({ ...mcq, moduleId }))
    )

    const module = await Module.findById(moduleId)
    if (!module)
      return res
        .status(404)
        .json({ success: false, message: 'Module not found' })

    module.mcqs.push(...savedMCQs.map((mcq) => mcq._id))
    await module.save()

    res.status(201).json({ success: true, mcqs: savedMCQs })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Update an MCQ
app.put('/api/modules/mcqs/:mcqId', async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body
    const mcq = await MCQ.findByIdAndUpdate(
      req.params.mcqId,
      { question, options, correctAnswer },
      { new: true }
    )
    if (!mcq)
      return res.status(404).json({ success: false, message: 'MCQ not found' })

    res.status(200).json({ success: true, mcq })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})

// Delete an MCQ
app.delete('/api/modules/mcqs/:mcqId', async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndDelete(req.params.mcqId)
    if (!mcq)
      return res.status(404).json({ success: false, message: 'MCQ not found' })

    res.status(200).json({ success: true, message: 'MCQ deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message })
  }
})
// (Your existing routes remain the same, and you can add endpoints for interacting with the new schemas as needed)

// Starting server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//vikram code

// const express = require('express')
// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const multer = require('multer')
// const path = require('path')
// const fileUpload = require('express-fileupload')

// const app = express()
// app.use(express.json())

// const jwtSecret = 'secret123'

// // Database connection
// mongoose.connect(
//   'mongodb+srv://envidox:lms_backend@cluster0.ngrck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// )

// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'MongoDB connection error:'))
// db.once('open', () => {
//   console.log('MongoDB connected')
// })

// // Schemas
// const FileSchema = new mongoose.Schema({
//   name: String,
//   path: String,
//   fileType: String,
//   size: Number,
// })

// const ModuleSchema = new mongoose.Schema({
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true,
//   },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
//   mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }],
// })

// const MCQSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: { type: [String], required: true },
//   correctAnswer: { type: String, required: true },
//   moduleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Module',
//     required: true,
//   },
// })

// const CourseSchema = new mongoose.Schema({
//   courseId: String,
//   title: String,
//   description: String,
//   modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
// })

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['admin', 'evaluator', 'student'],
//     default: 'student',
//   },
// })

// // New Schemas
// const StudentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   assignedCourses: [
//     {
//       courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
//       progress: { type: Number, default: 0, min: 0, max: 100 },
//       status: {
//         type: String,
//         enum: ['assigned', 'completed', 'pending'],
//         default: 'assigned',
//       },
//       certification: { type: String, default: null },
//     },
//   ],
//   completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
//   pendingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
// })

// const EvaluatorSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
//   verifiedAssessments: [
//     { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
//   ],
//   approvedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
// })

// const AdminSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// })

// // Models
// const File = mongoose.model('File', FileSchema)
// const Module = mongoose.model('Module', ModuleSchema)
// const Course = mongoose.model('Course', CourseSchema)
// const User = mongoose.model('User', UserSchema)
// const MCQ = mongoose.model('MCQ', MCQSchema)
// const Student = mongoose.model('Student', StudentSchema)
// const Evaluator = mongoose.model('Evaluator', EvaluatorSchema)
// const Admin = mongoose.model('Admin', AdminSchema)

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(`null, ${Date.now()}_${file.originalname}`)
//   },
// })

// const upload = multer({ storage })

// // Routes
// // Middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// // Middleware to verify admin access
// const verifyAdmin = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const admin = await User.findOne({ email });
//     if (!admin || admin.role !== 'admin') {
//       return res.status(403).json({ msg: 'Access denied. Admins only.' });
//     }
//     next();
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

// // Routes

// /** User Registration / student/evaluator/admin creation */
// app.post('/api/users/register', async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// app.post('/upload-csv', async (req, res) => {
//   if (!req.files || !req.files.csv) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const filePath = `./uploads/${req.files.csv.name}`;
//   req.files.csv.mv(filePath, async (err) => {
//     if (err) return res.status(500).send(err);

//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', async () => {
//         try {
//           const studentData = await Promise.all(
//             results.map(async (student) => {
//               // Check if course exists
//               const course = await Course.findOne({ courseId: student.courseId });
//               if (!course) {
//                 throw new Error(`Course with ID ${student.courseId} does not exist.`);
//               }

//               return {
//                 name: student.name,
//                 email: student.email,
//                 password: await bcrypt.hash(student.password, 10), // Hash passwords
//                 role: student.role || 'Student',
//                 courses: [course._id], // Assign course
//               };
//             })
//           );

//           await User.insertMany(studentData);
//           res.status(200).send('Students and their courses uploaded successfully.');
//         } catch (error) {
//           res.status(500).send(`Error: ${error.message}`);
//         } finally {
//           fs.unlinkSync(filePath); // Delete file after processing
//         }
//       });
//   });
// });

// // Update a student (Students can update their own details)
// app.put('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, email, password } = req.body;

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     if (user.role !== 'student') {
//       return res.status(403).json({ msg: 'Only students can update their details.' });
//     }

//     // Update fields
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }

//     await user.save();

//     res.status(200).json({ msg: 'User updated successfully', user });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Delete a student (Admin only)
// app.delete('/api/users/:id', verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     if (user.role !== 'student') {
//       return res.status(403).json({ msg: 'Only students can be deleted by the admin.' });
//     }

//     await user.remove();

//     res.status(200).json({ msg: 'User deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Get all students (Admin only)
// app.get('/api/users', verifyAdmin, async (req, res) => {
//   try {
//     const students = await User.find({ role: 'student' });
//     res.status(200).json(students);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Get a specific student (Admin only)
// app.get('/api/users/:id', verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     if (user.role !== 'student') {
//       return res.status(403).json({ msg: 'Only student details can be retrieved by admin.' });
//     }

//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Update an evaluator (Evaluators can update their own details)
// app.put('/api/evaluators/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, email, password } = req.body;

//   try {
//     const evaluator = await User.findById(id);

//     if (!evaluator) {
//       return res.status(404).json({ msg: 'Evaluator not found' });
//     }

//     if (evaluator.role !== 'evaluator') {
//       return res.status(403).json({ msg: 'Only evaluators can update their details.' });
//     }

//     // Update fields
//     if (name) evaluator.name = name;
//     if (email) evaluator.email = email;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       evaluator.password = await bcrypt.hash(password, salt);
//     }

//     await evaluator.save();

//     res.status(200).json({ msg: 'Evaluator updated successfully', evaluator });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Delete an evaluator (Admin only)
// app.delete('/api/evaluators/:id', verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const evaluator = await User.findById(id);

//     if (!evaluator) {
//       return res.status(404).json({ msg: 'Evaluator not found' });
//     }

//     if (evaluator.role !== 'evaluator') {
//       return res.status(403).json({ msg: 'Only evaluators can be deleted by the admin.' });
//     }

//     await evaluator.remove();

//     res.status(200).json({ msg: 'Evaluator deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Get all evaluators (Admin only)
// app.get('/api/evaluators', verifyAdmin, async (req, res) => {
//   try {
//     const evaluators = await User.find({ role: 'evaluator' });
//     res.status(200).json(evaluators);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // Get a specific evaluator (Admin only)
// app.get('/api/evaluators/:id', verifyAdmin, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const evaluator = await User.findById(id);

//     if (!evaluator) {
//       return res.status(404).json({ msg: 'Evaluator not found' });
//     }

//     if (evaluator.role !== 'evaluator') {
//       return res.status(403).json({ msg: 'Only evaluator details can be retrieved by admin.' });
//     }

//     res.status(200).json(evaluator);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// /** User Login */
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = { user: { id: user.id, name: user.name, role: user.role } };

//     jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token, user: { name: user.name, role: user.role } });
//     });
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// /** Course Management */
// // Get all courses
// app.get('/api/courses', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json({ success: true, courses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Get a specific course by ID
// app.get('/api/courses/:courseId', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId).populate('modules');
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Create a new course
// app.post('/api/courses', async (req, res) => {
//   try {
//     const { courseId, title, description } = req.body;
//     const course = new Course({ courseId, title, description });
//     await course.save();
//     res.status(201).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update a course
// app.put('/api/courses/:courseId', async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const course = await Course.findByIdAndUpdate(req.params.courseId, { title, description }, { new: true });
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, course });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete a course
// app.delete('/api/courses/:courseId', async (req, res) => {
//   try {
//     const course = await Course.findByIdAndDelete(req.params.courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, message: 'Course deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });
// // Get all modules for a course
// app.get('/api/courses/:courseId/modules', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId).populate('modules');
//     if (!course) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }
//     res.status(200).json({ success: true, modules: course.modules });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Add a module to a course
// app.post('/api/courses/:courseId/modules', upload.array('files'), async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { name, description } = req.body;

//     const files = await Promise.all(req.files.map(async (file) => {
//       const newFile = new File({
//         name: file.originalname,
//         path:`/uploads/${file.filename}`,
//         fileType: file.mimetype,
//         size: file.size,
//       });
//       return await newFile.save();
//     }));

//     const module = new Module({
//       courseId,
//       name,
//       description,
//       files: files.map(file => file._id),
//     });

//     const savedModule = await module.save();

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

//     course.modules.push(savedModule._id);
//     await course.save();

//     res.status(201).json({ success: true, module: savedModule });
//   }catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update a module
// app.put('/api/modules/:moduleId', async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const module = await Module.findByIdAndUpdate(req.params.moduleId, { name, description }, { new: true });
//     if (!module) {
//       return res.status(404).json({ success: false, message: 'Module not found' });
//     }
//     res.status(200).json({ success: true, module });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete a module
// app.delete('/api/modules/:moduleId', async (req, res) => {
//   try {
//     const module = await Module.findByIdAndDelete(req.params.moduleId);
//     if (!module) {
//       return res.status(404).json({ success: false, message: 'Module not found' });
//     }
//     res.status(200).json({ success: true, message: 'Module deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });
// // Add MCQs to a module
// app.post('/api/modules/:moduleId/mcqs', async (req, res) => {
//   try {
//     const { mcqs } = req.body;
//     const { moduleId } = req.params;

//     if (!Array.isArray(mcqs) || mcqs.length === 0) {
//       return res.status(400).json({ success: false, message: 'Invalid MCQs data' });
//     }

//     const savedMCQs = await MCQ.insertMany(mcqs.map(mcq => ({ ...mcq, moduleId })));

//     const module = await Module.findById(moduleId);
//     if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

//     module.mcqs.push(...savedMCQs.map(mcq => mcq._id));
//     await module.save();

//     res.status(201).json({ success: true, mcqs: savedMCQs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Update an MCQ
// app.put('/api/mcqs/:mcqId', async (req, res) => {
//   try {
//     const { question, options, correctAnswer } = req.body;
//     const mcq = await MCQ.findByIdAndUpdate(
//       req.params.mcqId,
//       { question, options, correctAnswer },
//       { new: true }
//     );
//     if (!mcq) return res.status(404).json({ success: false, message: 'MCQ not found' });

//     res.status(200).json({ success: true, mcq });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });

// // Delete an MCQ
// app.delete('/api/mcqs/:mcqId', async (req, res) => {
//   try {
//     const mcq = await MCQ.findByIdAndDelete(req.params.mcqId);
//     if (!mcq) return res.status(404).json({ success: false, message: 'MCQ not found' });

//     res.status(200).json({ success: true, message: 'MCQ deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });
// // (Your existing routes remain the same, and you can add endpoints for interacting with the new schemas as needed)

// // Starting server
// const PORT = process.env.PORT || 5008
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
