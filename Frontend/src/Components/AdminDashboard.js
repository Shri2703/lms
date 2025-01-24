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
  const [courses, setCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState({}) // Track expanded courses
  const [loading, setLoading] = useState(true) // Tracks loading state
  const [error, setError] = useState(null)
  const [evaluators, setEvaluators] = useState([])
  const [showAddCourseForm, setShowAddCourseForm] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })
  

  // const [showCourseAssignForm, setShowCourseAssignForm] = useState(false)
  // const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('')
  // const [selectedCourseId, setSelectedCourseId] = useState('')
  const [editCourse, setEditCourse] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddEvaluatorForm, setShowAddEvaluatorForm] = useState(false)
  const [newEvaluator, setNewEvaluator] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [assignData, setAssignData] = useState({
    evaluatorId: '',
    courseId: '',
  })
  const [unassignData, setUnassignData] = useState({
    evaluatorId: '',
    courseId: '',
  })

  const [showUnassignCourseForm, setShowUnassignCourseForm] = useState(false)

  const [showAssignCourseForm, setShowAssignCourseForm] = useState(false)
  // Define courseDetails state here to manage course details visibility

  // State variables for Student Management
  const [students, setStudents] = useState([])
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [assignStudentData, setAssignStudentData] = useState({
    studentId: '',
    courseId: '',
  })
  const [unassignStudentData, setUnassignStudentData] = useState({
    studentId: '',
    courseId: '',
  })
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  // State variables for Student Management
  
  const [showAssignStudentCourseForm, setShowAssignStudentCourseForm] =
    useState(false)
  const [showUnassignStudentCourseForm, setShowUnassignStudentCourseForm] =
    useState(false)

  const [selectedFile, setSelectedFile] = useState(null)
  const [showFileInput, setShowFileInput] = useState(false)
  const [showBulkRegisterForm, setShowBulkRegisterForm] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allcourses')
        if (response.data.success) {
          setCourses(response.data.courses)
        } else {
          throw new Error('Failed to fetch courses')
        }
      } catch (err) {
        setError(err.message || 'Error fetching courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
    fetchEvaluators()
    fetchStudents()
  }, [])
  const fetchEvaluators = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/evaluators')
      setEvaluators(response.data)
    } catch (error) {
      console.error('Error fetching evaluators:', error)
    }
  }
 const fetchStudents = async () => {
   try {
     const response = await axios.get('http://localhost:5000/api/students')
     // Access the 'students' array from the response object
     setStudents(response.data.students)
   } catch (error) {
     console.error('Error fetching students:', error)
   }
 }


  const handleAddCourse = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        newCourse
      )
      if (response.data.success) {
        setCourses([...courses, response.data.course])
        setShowAddCourseForm(false)
        setNewCourse({ title: '', description: '' })
      }
    } catch (err) {
      console.error('Error adding course:', err)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/${editCourse._id}`,
        editCourse
      )
      if (response.data.success) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editCourse._id ? response.data.course : course
          )
        )
        setIsEditing(false)
        setEditCourse(null)
      }
    } catch (err) {
      console.error('Error updating course:', err)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/courses/${courseId}`
      )
      if (response.data.success) {
        setCourses(courses.filter((course) => course._id !== courseId))
      }
    } catch (err) {
      console.error('Error deleting course:', err)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const toggleCourseDetails = (courseTitle) => {
    setCourseDetails((prev) => ({
      ...prev,
      [courseTitle]: !prev[courseTitle],
    }))
  }

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = jwt_decode(token)
      setUsername(userData.user.name)
    }
  }, [])
  const handleAddModule = (courseId) => {
    navigate(`/addmodules/${courseId}`)
  }

  if (loading) {
    return <p>Loading courses...</p>
  }

  if (error) {
    return <p className='text-red-500'>Error: {error}</p>
  }

  const handleAddEvaluator = async () => {
    try {
      await axios.post('http://localhost:5000/api/evaluator', newEvaluator)
      setNewEvaluator({ name: '', email: '', password: '' })
      setShowAddEvaluatorForm(false)
      fetchEvaluators()
    } catch (error) {
      console.error('Error adding evaluator:', error)
    }
  }

  const handleAssignCourse = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/evaluators/assign-courses/${assignData.evaluatorId}`,
        {
          courseIds: [assignData.courseId],
        }
      )
      setAssignData({ evaluatorId: '', courseId: '' })
      setShowAssignCourseForm(false)
      fetchEvaluators()
    } catch (error) {
      console.error('Error assigning course:', error)
    }
  }

  const handleUnassignCourse = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/evaluators/${unassignData.evaluatorId}/unassign-course`,
        {
          data: { courseId: unassignData.courseId },
        }
      )
      setUnassignData({ evaluatorId: '', courseId: '' })
      setShowUnassignCourseForm(false)
      fetchEvaluators()
    } catch (error) {
      console.error('Error unassigning course:', error)
    }
  }

   const handleBulkRegister = async () => {
     if (!selectedFile) {
       alert('Please select a file first!')
       return
     }

     const formData = new FormData()
     formData.append('csv', selectedFile)

     try {
       const response = await fetch(
         'http://localhost:5000/register-bulk-students',
         {
           method: 'POST',
           body: formData,
         }
       )
       const result = await response.json()

       if (response.ok) {
         alert('Bulk registration successful!')
         fetchStudents()
       } else {
         alert(`Failed: ${result.message}`)
       }
     } catch (error) {
       console.error('Bulk registration error:', error)
       alert('Something went wrong. Please try again.')
     }
   }
  const handleFileChange = (event) => {
     setSelectedFile(event.target.files[0])
   }

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.password) {
      alert('Please fill out all fields')
      return
    }

    try {
      await axios.post('http://localhost:5000/api/students', newStudent)
      setNewStudent({ name: '', email: '', password: '' })
      setShowAddStudentForm(false)
      fetchStudents() // Ensure fetchStudents is properly defined
    } catch (error) {
      console.error(
        'Error adding student:',
        error.response?.data || error.message
      )
    }
  }


  const handleAssignCourseToStudent = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/students/${assignStudentData.studentId}/assign-course`,
        {
          courseId: assignStudentData.courseId,
        }
      )
      setAssignStudentData({ studentId: '', courseId: '' })
      setShowAssignStudentCourseForm(false)
      fetchStudents()
    } catch (error) {
      console.error('Error assigning course to student:', error)
    }
  }

  // Unassign a course from a student
  const handleUnassignCourseFromStudent = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/students/${unassignStudentData.studentId}/unassign-course`,
        {
          data: { courseId: unassignStudentData.courseId },
        }
      )
      setUnassignStudentData({ studentId: '', courseId: '' })
      setShowUnassignStudentCourseForm(false)
      fetchStudents()
    } catch (error) {
      console.error('Error unassigning course from student:', error)
    }
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

        {/* Conditional Rendering for Dashboard */}
        {currentSection === 'dashboard' && (
          <div id='course-link' className='bg-light'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Course Management
              </h2>
              <button
                onClick={() => setShowAddCourseForm(true)}
                className='px-6 py-2 bg-primary text-white rounded-md'
              >
                Add Course
              </button>
            </div>

            {/* Courses List */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {courses.map((course) => (
                <div className='p-4 border rounded-md shadow-md'>
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
                          className='px-4 py-2 bg-primary text-white rounded-md mr-2'
                          onClick={() => {
                            setEditCourse(course)
                            setIsEditing(true)
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className='px-4 py-2 bg-primary text-white rounded-md'
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
          </div>
        )}
        {/* Add Course Form */}
        {showAddCourseForm && (
          <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md mb-6'>
            <h2 className='text-xl font-bold text-primary mb-4'>Add Course</h2>
            <div className='space-y-4'>
              <input
                type='text'
                className='w-full p-2 border rounded-md'
                placeholder='Course Title'
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                className='w-full p-2 border rounded-md'
                placeholder='Course Description'
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <div className='flex justify-between'>
                <button
                  onClick={handleAddCourse}
                  className='px-6 py-2 bg-blue-500 text-white rounded-md'
                >
                  Add Course
                </button>
                <button
                  onClick={() => setShowAddCourseForm(false)}
                  className='px-6 py-2 bg-red-500 text-white rounded-md'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <div className='bg-white p-6 rounded-md shadow-md'>
            <h2 className='text-xl font-bold mb-4'>Edit Course</h2>
            <input
              type='text'
              value={editCourse.title}
              className='w-full p-2 border rounded-md mb-2'
              onChange={(e) =>
                setEditCourse((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <textarea
              value={editCourse.description}
              className='w-full p-2 border rounded-md mb-2'
              onChange={(e) =>
                setEditCourse((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <div className='flex space-x-4'>
              <button
                className='px-4 py-2 bg-green-500 text-white rounded-md'
                onClick={handleUpdateCourse}
              >
                Save
              </button>
              <button
                className='px-4 py-2 bg-gray-500 text-white rounded-md'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {currentSection === 'evaluator' && (
          <div id='evaluator-link' className='bg-light p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Evaluator Management
              </h2>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md'
                onClick={() => setShowAddEvaluatorForm(!showAddEvaluatorForm)}
              >
                {showAddEvaluatorForm ? 'Close Form' : 'Add Evaluator'}
              </button>
            </div>

            <h3 className='text-lg font-semibold mb-2'>List of Evaluators</h3>
            <table className='table-auto w-full border-collapse border border-black-200  mb-4'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>Name</th>
                  <th className='border border-gray-300 px-4 py-2'>Email</th>
                </tr>
              </thead>
              <tbody>
                {evaluators.length > 0 ? (
                  evaluators.map((evaluator) => (
                    <tr key={evaluator._id}>
                      <td className='border border-gray-300 px-4 py-2'>
                        {evaluator.userId.name}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {evaluator.userId.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className='border border-gray-300 px-4 py-2'
                      colSpan='2'
                    >
                      No evaluators available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className='flex items-center justify-between mt-5'>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md '
                onClick={() => setShowAssignCourseForm(!showAssignCourseForm)}
              >
                {showAssignCourseForm
                  ? 'Close Assign Course Form'
                  : 'Assign Course'}
              </button>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md '
                onClick={() =>
                  setShowUnassignCourseForm(!showUnassignCourseForm)
                }
              >
                {showUnassignCourseForm
                  ? 'Close Unassign Course Form'
                  : 'Unassign Course'}
              </button>
            </div>

            {showAddEvaluatorForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Add Evaluator</h3>
                <input
                  type='text'
                  placeholder='Name'
                  value={newEvaluator.name}
                  onChange={(e) =>
                    setNewEvaluator({ ...newEvaluator, name: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                  required
                />
                <input
                  type='email'
                  placeholder='Email'
                  value={newEvaluator.email}
                  onChange={(e) =>
                    setNewEvaluator({ ...newEvaluator, email: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={newEvaluator.password}
                  onChange={(e) =>
                    setNewEvaluator({
                      ...newEvaluator,
                      password: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                  required
                />
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleAddEvaluator}
                >
                  Submit
                </button>
                <button
                  className='ml-4 px-4 py-2 bg-gray-500 text-white rounded-md'
                  onClick={() => setShowAddEvaluatorForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {showAssignCourseForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Assign Course</h3>
                <select
                  value={assignData.evaluatorId}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      evaluatorId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Evaluator</option>
                  {evaluators.map((evaluator) => (
                    <option key={evaluator._id} value={evaluator._id}>
                      {evaluator.userId.name}
                    </option>
                  ))}
                </select>
                <select
                  value={assignData.courseId}
                  onChange={(e) =>
                    setAssignData({ ...assignData, courseId: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleAssignCourse}
                >
                  Assign
                </button>
              </div>
            )}

            {showUnassignCourseForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Unassign Course</h3>
                <select
                  value={unassignData.evaluatorId}
                  onChange={(e) =>
                    setUnassignData({
                      ...unassignData,
                      evaluatorId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Evaluator</option>
                  {evaluators.map((evaluator) => (
                    <option key={evaluator._id} value={evaluator._id}>
                      {evaluator.userId.name}
                    </option>
                  ))}
                </select>
                <select
                  value={unassignData.courseId}
                  onChange={(e) =>
                    setUnassignData({
                      ...unassignData,
                      courseId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleUnassignCourse}
                >
                  Unassign
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection === 'studentmanagement' && (
          <div id='student-management-link' className='bg-light p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-primary'>
                Student Management
              </h2>
              <button
                className='px-4 py-2  m-2 bg-primary text-white rounded-md'
                onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              >
                {showAddStudentForm ? 'Close Form' : 'Add Student'}
              </button>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md'
                onClick={() => setShowBulkRegisterForm((prev) => !prev)}
              >
                {showBulkRegisterForm
                  ? 'Close Bulk Register Form'
                  : 'Bulk Register Students'}
              </button>
            </div>

            <h3 className='text-lg font-semibold mb-2'>List of Students</h3>
            <table className='table-auto w-full border-collapse border border-black-200 mb-4'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>Name</th>
                  <th className='border border-gray-300 px-4 py-2'>Email</th>
                  {/* <th className='border border-gray-300 px-4 py-2'>
                    Assigned Courses
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td className='border border-gray-300 px-4 py-2'>
                        {student.userId?.name || 'No Name'}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        {student.userId?.email || 'No Email'}
                      </td>
                      {/* <td className='border border-gray-300 px-4 py-2'>
                        {student.assignedCourses
                          .map(
                            (course) =>
                              course.courseId?.title || 'No Title'
                          )
                          .join(', ')}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className='border border-gray-300 px-4 py-2'
                      colSpan='3'
                    >
                      No students available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className='flex items-center justify-between mt-5'>
              <button
                className='px-4 py-2 m-2 bg-primary text-white rounded-md'
                onClick={() =>
                  setShowAssignStudentCourseForm(!showAssignStudentCourseForm)
                }
              >
                {showAssignStudentCourseForm
                  ? 'Close Assign Course Form'
                  : 'Assign Course to Student'}
              </button>
              <button
                className='px-4 py-2 bg-primary text-white rounded-md'
                onClick={() =>
                  setShowUnassignStudentCourseForm(
                    !showUnassignStudentCourseForm
                  )
                }
              >
                {showUnassignStudentCourseForm
                  ? 'Close Unassign Course Form'
                  : 'Unassign Course from Student'}
              </button>
            </div>

            {showAddStudentForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Add Student</h3>
                <input
                  type='text'
                  placeholder='Name'
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                />
                <input
                  type='email'
                  placeholder='Email'
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                />
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleAddStudent}
                >
                  Submit
                </button>
                <button
                  className='ml-4 px-4 py-2 bg-gray-500 text-white rounded-md'
                  onClick={() => setShowAddStudentForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {showAssignStudentCourseForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>
                  Assign Course to Student
                </h3>
                <select
                  value={assignStudentData.studentId}
                  onChange={(e) =>
                    setAssignStudentData({
                      ...assignStudentData,
                      studentId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.userId.name}
                    </option>
                  ))}
                </select>
                <select
                  value={assignStudentData.courseId}
                  onChange={(e) =>
                    setAssignStudentData({
                      ...assignStudentData,
                      courseId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleAssignCourseToStudent}
                >
                  Assign
                </button>
                <button
                  className='ml-4 px-4 py-2 bg-gray-500 text-white rounded-md'
                  onClick={() => setShowAssignStudentCourseForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {showUnassignStudentCourseForm && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>
                  Unassign Course from Student
                </h3>
                <select
                  value={unassignStudentData.studentId}
                  onChange={(e) =>
                    setUnassignStudentData({
                      ...unassignStudentData,
                      studentId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.userId.name}
                    </option>
                  ))}
                </select>
                <select
                  value={unassignStudentData.courseId}
                  onChange={(e) =>
                    setUnassignStudentData({
                      ...unassignStudentData,
                      courseId: e.target.value,
                    })
                  }
                  className='block w-full p-2 mb-2 border rounded'
                >
                  <option value=''>Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  className='px-4 py-2 bg-gray-600 text-white rounded-md'
                  onClick={handleUnassignCourseFromStudent}
                >
                  Unassign
                </button>
                <button
                  className='ml-4 px-4 py-2 bg-gray-500 text-white rounded-md'
                  onClick={() => setShowUnassignStudentCourseForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {showBulkRegisterForm && (
              <div className='mt-4 border p-4 rounded-md shadow-md'>
                <h3 className='text-lg font-semibold mb-2'>Upload CSV File</h3>
                <input
                  type='file'
                  accept='.csv'
                  onChange={handleFileChange}
                  className='border p-2 w-full'
                />
                <div className='mt-4'>
                  <button
                    className='px-4 py-2 bg-green-500 text-white rounded-md'
                    onClick={handleBulkRegister}
                  >
                    Upload and Register
                  </button>
                  <button
                    className='ml-4 px-4 py-2 bg-gray-500 text-white rounded-md'
                    onClick={() => setShowBulkRegisterForm(false)}
                  >
                    Cancel
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
