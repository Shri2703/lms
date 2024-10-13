import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBars,
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
  FaArrowDown,
} from 'react-icons/fa'
import user from '../Images/user.png'
import Adminsidenav from './Adminsidenav'
import { jwtDecode as jwt_decode } from 'jwt-decode'
import axios from 'axios'

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [courseDetails, setCourseDetails] = useState({})
  const [courses, setCourses] = useState([])
  const [evaluators, setEvaluators] = useState([])
  const [students, setStudents] = useState([])
  const [showAddCourseForm, setShowAddCourseForm] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })
  const [showUpdateCourseForm, setShowUpdateCourseForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showAddEvaluatorForm, setShowAddEvaluatorForm] = useState(false)
  const [newEvaluator, setNewEvaluator] = useState({
    name: '',
    email: '',
    password: '',
    role: 'evaluator',
  })
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })

  const [showCourseAssignForm, setShowCourseAssignForm] = useState(false)
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  

  // Fetch evaluators and courses on component mount
  
  useEffect(() => {
    const fetchEvaluators = async () => {
      const response = await fetch('/api/evaluators')
      if (!response.ok) {
        alert('Failed to fetch evaluators')
        return
      }
      const data = await response.json()
      setEvaluators(data)
    }

    const fetchCourses = async () => {
      const response = await fetch('/api/allcourses')
      if (!response.ok) {
        alert('Failed to fetch courses')
        return
      }
      const data = await response.json()
      setCourses(data)
    }

    fetchEvaluators()
    fetchCourses()
  }, [])


  const handleAssignCourse = async () => {
    if (!selectedEvaluatorId || !selectedCourseId) {
      alert('Please select an evaluator and a course.')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/evaluators/assign-course',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            evaluatorId: selectedEvaluatorId,
            courseId: selectedCourseId,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert('Course assigned successfully.')
        setShowCourseAssignForm(false)
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      alert('Error assigning course. Please try again.')
    }
  }



  

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        'http://localhost:5000/api/users/students',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setStudents(response.data)
    } catch (err) {
      console.error('Error fetching students:', err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleAddStudent = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/users/register', newStudent, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      setShowAddStudentForm(false)
      setNewStudent({ name: '', email: '', password: '', role: 'student' })
      fetchStudents() // Refresh student list after adding
    } catch (err) {
      console.error('Error adding student:', err)
    }
  }

  const fetchEvaluators = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        'http://localhost:5000/api/users/evaluators',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setEvaluators(response.data)
    } catch (err) {
      console.error('Error fetching evaluators:', err)
    }
  }

  useEffect(() => {
    fetchEvaluators()
  }, [])

  const handleAddEvaluator = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/users/register',
        newEvaluator,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setShowAddEvaluatorForm(false)
      setNewEvaluator({ name: '', email: '', password: '', role: 'evaluator' })
      fetchEvaluators() // Refresh the evaluator list after adding
    } catch (err) {
      console.error('Error adding evaluator:', err)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const toggleCourseDetails = (course) => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [course]: !prevDetails[course],
    }))
  }

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        newCourse,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCourses([...courses, response.data])
      setShowAddCourseForm(false)
      setNewCourse({ title: '', description: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:5000/api/courses/${selectedCourse._id}`,
        newCourse,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setCourses(
        courses.map((course) =>
          course._id === selectedCourse._id ? response.data : course
        )
      )
      setShowUpdateCourseForm(false)
      setNewCourse({ title: '', description: '' })
      setSelectedCourse(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCourses(courses.filter((course) => course._id !== courseId))
    } catch (err) {
      console.error('Error deleting course:', err)
    }
  }

  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = jwt_decode(token)
      setUsername(userData.user.name)
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/allcourses',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setCourses(response.data)
      } catch (err) {
        console.error('Error fetching courses:', err)
      }
    }

    const fetchEvaluators = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/evaluators',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEvaluators(response.data)
      } catch (err) {
        console.error('Error fetching evaluators:', err)
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/students',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setStudents(response.data)
      } catch (err) {
        console.error('Error fetching students:', err)
      }
    }

    fetchCourses()
    fetchEvaluators()
    fetchStudents()
  }, [])

  const handleCreateNewTest = () => {
    navigate('/createnewtest')
  }

  const handleAddModule = (courseId) => {
    navigate(`/addmodules/${courseId}`)
  }

  const handleUpdateClick = (course) => {
    setSelectedCourse(course)
    setNewCourse({ title: course.title, description: course.description })
    setShowUpdateCourseForm(true)
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basic`}>
      <Adminsidenav
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <div className='flex-grow p-5 md:ml-4'>
        <button
          className='md:hidden flex items-center mb-4 px-3 py-2 border rounded text-primary border-gray-600 hover:text-primary hover:bg-secondary'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-14'>
            <div className='relative'>
              <FaSearch className='absolute top-3 left-4 text-primary' />
              <input
                type='text'
                className='pl-10 pr-4 py-2 w-72 border rounded-full text-primary focus:outline-none focus:shadow-outline'
                placeholder='Search...'
              />
            </div>
            <FaBell className='text-primary hover:text-dark' />
          </div>
          <div className='flex items-center space-x-6'>
            <button
              onClick={toggleDarkMode}
              className='text-primary hover:text-dark'
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <img src={user} alt='Profile' className='w-10 h-10 rounded-full' />
            <div>
              <p className='text-primary'>{username}</p>
              <p className='text-sm text-dark'>Admin</p>
            </div>
          </div>
        </div>
        {currentSection === 'dashboard' && (
          <div id='course-link' className='bg-light'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Course Management
              </h2>
              <button
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className='px-6 py-2 bg-primary text-white rounded-md'
              >
                Add Course
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {courses.map((course, index) => (
                <div key={index} className='p-4 border rounded-md shadow-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-semibold'>{course.title}</h3>
                      <p>{course.description}</p>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => toggleCourseDetails(course.title)}
                        className='px-4 py-2 bg-primary text-white rounded-md'
                      >
                        {courseDetails[course.title]
                          ? 'View Less'
                          : 'View More'}
                      </button>
                    </div>
                  </div>
                  {courseDetails[course.title] && (
                    <div className='mt-4 space-y-4'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleUpdateClick(course)}
                          className='px-4 py-2 bg-yellow-500 text-white rounded-md'
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className='px-4 py-2 bg-red-500 text-white rounded-md'
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleAddModule(course._id)}
                          className='px-6 py-2 bg-primary text-white rounded-md'
                        >
                          Add Module
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAddCourseForm && (
              <div className='mt-4 p-4 border rounded-md'>
                <h3 className='text-lg font-semibold mb-2'>Add New Course</h3>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>Title</label>
                  <input
                    type='text'
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>
                    Description
                  </label>
                  <input
                    type='text'
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <button
                  onClick={handleAddCourse}
                  className='px-6 py-2 bg-primary text-white rounded-md'
                >
                  Add Course
                </button>
              </div>
            )}

            {showUpdateCourseForm && (
              <div className='mt-4 p-4 border rounded-md'>
                <h3 className='text-lg font-semibold mb-2'>
                  Update Course: {selectedCourse?.title}
                </h3>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>Title</label>
                  <input
                    type='text'
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>
                    Description
                  </label>
                  <input
                    type='text'
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <button
                  onClick={handleUpdateCourse}
                  className='px-6 py-2 bg-primary text-white rounded-md'
                >
                  Update Course
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection === 'evaluator' && (
          <div id='evaluator-link' className='bg-light'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Evaluator Management
              </h2>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md'
                onClick={() => setShowAddEvaluatorForm(!showAddEvaluatorForm)}
              >
                Add Evaluator
              </button>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md ml-2'
                onClick={() => setShowCourseAssignForm(!showCourseAssignForm)}
              >
                Course Assigning
              </button>
            </div>

            {/* Evaluator List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {evaluators.map((evaluator, index) => (
                <div key={index} className='p-4 border rounded-md shadow-md'>
                  <div className='flex flex-col items-start'>
                    <h3 className='text-lg font-semibold'>{evaluator.name}</h3>
                    <p>{evaluator.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Evaluator Form */}
            {showAddEvaluatorForm && (
              <div className='mt-4 p-4 border rounded-md shadow-md'>
                <h3 className='text-lg font-semibold mb-2'>
                  Add New Evaluator
                </h3>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>Username</label>
                  <input
                    type='text'
                    value={newEvaluator.name}
                    onChange={(e) =>
                      setNewEvaluator({
                        ...newEvaluator,
                        name: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>Email</label>
                  <input
                    type='email'
                    value={newEvaluator.email}
                    onChange={(e) =>
                      setNewEvaluator({
                        ...newEvaluator,
                        email: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>Password</label>
                  <input
                    type='password'
                    value={newEvaluator.password}
                    onChange={(e) =>
                      setNewEvaluator({
                        ...newEvaluator,
                        password: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md'
                  />
                </div>
                <button
                  onClick={handleAddEvaluator}
                  className='px-6 py-2 bg-blue-500 text-white rounded-md'
                >
                  Add Evaluator
                </button>
              </div>
            )}

            {/* Course Assigning Form */}
            {showCourseAssignForm && (
              <div className='mt-4 p-4 border rounded-md shadow-md'>
                <h3 className='text-lg font-semibold mb-2'>Course Assigning</h3>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>
                    Select Evaluator
                  </label>
                  <select
                    value={selectedEvaluatorId}
                    onChange={(e) => setSelectedEvaluatorId(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value=''>Select Evaluator</option>
                    {evaluators.map((evaluator) => (
                      <option key={evaluator._id} value={evaluator._id}>
                        {evaluator.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='mb-2'>
                  <label className='block text-sm font-medium'>
                    Select Course
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className='w-full px-3 py-2 border rounded-md'
                  >
                    <option value=''>Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}{' '}
                        {/* Adjust according to your course field */}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAssignCourse}
                  className='px-6 py-2 bg-blue-500 text-white rounded-md'
                >
                  Assign Course
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection === 'studentmanagement' && (
          <div id='student-management-link' className='bg-light'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Student Management
              </h2>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md'
                onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              >
                Add Student
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {students.map((student, index) => (
                <div key={index} className='p-4 border rounded-md shadow-md'>
                  <div className='flex flex-col items-start'>
                    <h3 className='text-lg font-semibold'>{student.name}</h3>
                    <p>{student.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {showAddStudentForm && (
              <div className='mt-4 p-4 border rounded-md shadow-md'>
                <h3 className='text-lg font-semibold mb-2'>Add New Student</h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block mb-1'>Name</label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border rounded-md'
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block mb-1'>Email</label>
                    <input
                      type='email'
                      className='w-full px-4 py-2 border rounded-md'
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className='block mb-1'>Password</label>
                    <input
                      type='password'
                      className='w-full px-4 py-2 border rounded-md'
                      value={newStudent.password}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button
                    onClick={handleAddStudent}
                    className='px-6 py-2 bg-blue-500 text-white rounded-md'
                  >
                    Add Student
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
