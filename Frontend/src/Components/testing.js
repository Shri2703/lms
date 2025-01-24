import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaSearch, FaSun, FaMoon, FaBell } from 'react-icons/fa'
import userImage from '../Images/user.png'
import Adminsidenav from './Adminsidenav'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [courses, setCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddCourseForm, setShowAddCourseForm] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', description: '' })
  const [showUpdateCourseForm, setShowUpdateCourseForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      const decodedToken = jwt_decode(token)
      setUsername(decodedToken.username || 'Admin')
    }

    fetchCourses()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/courses')
      setCourses(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch courses')
      setLoading(false)
    }
  }

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await axios.post('/api/courses', newCourse)
      setCourses([...courses, response.data])
      setNewCourse({ title: '', description: '' })
      setShowAddCourseForm(false)
    } catch (err) {
      alert('Failed to add course')
    }
  }

  const handleUpdateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await axios.put(
        `/api/courses/${selectedCourse.id}`,
        newCourse
      )
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id ? response.data : course
        )
      )
      setSelectedCourse(null)
      setShowUpdateCourseForm(false)
    } catch (err) {
      alert('Failed to update course')
    }
  }

  const toggleCourseDetails = (courseId) => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [courseId]: !prevDetails[courseId],
    }))
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
            <img
              src={userImage}
              alt='Profile'
              className='w-10 h-10 rounded-full'
            />
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
              {courses.map((course) => (
                <div
                  key={course.id}
                  className='p-4 border rounded-md shadow-md'
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-semibold'>{course.title}</h3>
                      <p>{course.description}</p>
                    </div>
                    <button
                      onClick={() => toggleCourseDetails(course.id)}
                      className='px-4 py-2 bg-primary text-white rounded-md'
                    >
                      {courseDetails[course.id] ? 'View Less' : 'View More'}
                    </button>
                  </div>

                  {courseDetails[course.id] && (
                    <div className='mt-4 space-y-4'>
                      <p>
                        <strong>Details:</strong>{' '}
                        {course.details || 'No additional details available'}
                      </p>
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

            {showUpdateCourseForm && selectedCourse && (
              <div className='mt-4 p-4 border rounded-md'>
                <h3 className='text-lg font-semibold mb-2'>Update Course</h3>
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
      </div>
    </div>
  )
}

export default AdminDashboard


 {
   currentSection === 'evaluator' && (
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
           <h3 className='text-lg font-semibold mb-2'>Add New Evaluator</h3>
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
             <label className='block text-sm font-medium'>Select Course</label>
             <select
               value={selectedCourseId}
               onChange={(e) => setSelectedCourseId(e.target.value)}
               className='w-full px-3 py-2 border rounded-md'
             >
               <option value=''>Select Course</option>
               {courses.map((course) => (
                 <option key={course._id} value={course._id}>
                   {course.title} {/* Adjust according to your course field */}
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
   )
 }

 {
   currentSection === 'studentmanagement' && (
     <div id='student-management-link' className='bg-light'>
       <div className='flex items-center justify-between mb-4'>
         <h2 className='text-xl font-bold text-primary'>Student Management</h2>
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
   )
 }



 {currentSection === 'course' && (
             <div id="course">
               <h2 className="text-xl font-bold text-primary mb-4">Course Content</h2>
               <div>
                 {/* First Main Div - Recently Viewed Courses */}
                 <div className="mb-8">
                   <h3 className="flex items-left text-lg font-bold text-dark mb-4">Recently Viewed Courses</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white shadow-lg rounded-lg p-4" onClick={handleDBMSClick}>
                       <div className="flex items-center mb-4 space-x-8">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">DBMS</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">DBMS_2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '80%' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">80%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               End Date<br />
                               <span className="font-bold">June 30, 2024</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Start Date<br />
                               <span className="font-bold">June 1, 2024</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Test Date<br />
                               <span className="font-bold">July 15, 2024</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
 
                     {/* Duplicate card for Recently Viewed Courses */}
                     <div className="bg-white shadow-lg rounded-lg p-4" onClick={handleAssignmentClick}>
                       <div className="flex items-center mb-4 space-x-4">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">Assignment</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '80%' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">80%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               End Date<br />
                               <span className="font-bold">June 30, 2024</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Start Date<br />
                               <span className="font-bold">June 1, 2024</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Test Date<br />
                               <span className="font-bold">July 15, 2024</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
 
                 {/* Second Main Div - Active Courses */}
                 <div className="mb-8">
                   <h3 className="flex  items-left text-lg font-bold text-dark mb-4">Active Courses</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Duplicate the card structure for Active Courses */}
                     <div className="bg-white shadow-lg rounded-lg p-4">
                       <div className="flex items-center mb-4 space-x-4">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">Course Title</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">DBMS_2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '80%' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">80%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Coding<br />
                               <span className="font-bold">144</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               MCQ<br />
                               <span className="font-bold">180</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Duration<br />
                               <span className="font-bold">100 days</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                     {/* Duplicate card for Active Courses */}
                     <div className="bg-white shadow-lg rounded-lg p-4">
                       <div className="flex items-center mb-4 space-x-4">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">Course Title</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">DBMS_2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '80%' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">80%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Coding<br />
                               <span className="font-bold">144</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               MCQ<br />
                               <span className="font-bold">180</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Duration<br />
                               <span className="font-bold">100 days</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
 
                 {/* Third Main Div - Expired Courses */}
                 <div className="mb-8">
                   <h3 className="flex  items-left text-lg font-bold text-dark mb-4">Expired Courses</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Duplicate the card structure for Expired Courses */}
                     <div className="bg-white shadow-lg rounded-lg p-4">
                       <div className="flex items-center mb-4 space-x-4">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">Course Title</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">DBMS_2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '0' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">0%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Coding<br />
                               <span className="font-bold">144</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               MCQ<br />
                               <span className="font-bold">180</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Duration<br />
                               <span className="font-bold">100 days</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                     {/* Duplicate card for Expired Courses */}
                     <div className="bg-white shadow-lg rounded-lg p-4">
                       <div className="flex items-center mb-4 space-x-4">
                         <FaBook className="text-primary" />
                         <h3 className="text-lg font-bold text-primary">Course Title</h3>
                         <p className="text-sm text-gray-500 ml-auto">Valid Till: June 30, 2024</p>
                       </div>
                       <p className="text-sm text-gray-700 mb-2">DBMS_2024</p>
                       <div className="mb-2">
                         <div className="flex items-center mb-2">
                           <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                             <div className="bg-bar h-full" style={{ width: '0%' }}></div>
                           </div>
                           <p className="text-sm text-gray-700 ml-2">0%</p>
                         </div>
                         <p className="text-sm text-gray-500">Enrolled, Started</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-700 ml-2">
                               Coding<br />
                               <span className="font-bold">144</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaCalendarAlt className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               MCQ<br />
                               <span className="font-bold">180</span>
                             </p>
                           </div>
                         </div>
                         <div className="flex justify-between">
                           <div className="flex items-center">
                             <FaRegComments className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Assessment<br />
                               <span className="font-bold">24</span>
                             </p>
                           </div>
                           <div className="flex items-center">
                             <FaClock className="text-primary" />
                             <p className="text-sm text-gray-500 ml-2">
                               Duration<br />
                               <span className="font-bold">100 days</span>
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
 
               
                 {/* Add content for Courses & Badges */}
                 {/* Second Main Div - Courses & Badges */}
                   <div className="mb-8">
                     <h3 className="text-lg font-bold text-primary mb-4">Courses & Badges</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       {/* First Card */}
                       <div className="bg-white shadow-lg rounded-lg p-4 flex flex-row justify-around">
                         <div className='flex items-center justify-start'>
                           <p className="text-sm text-gray-700 mb-2"> 3 <br></br> Enrolled Course</p>
                           <p className="text-sm text-gray-500"></p>
                         </div>
                         <div className="flex items-center justify-end">
                           <FaBookmark className="text-primary" />
                         </div>
                       </div>
                       {/* Second Card */}
                       <div className="bg-white shadow-lg rounded-lg p-4 flex flex-row justify-around">
                         <div className='flex items-center justify-start'>
                           <p className="text-sm text-gray-700 mb-2"> 0 <br></br>Completed</p>
                           <p className="text-sm text-gray-500"></p>
                         </div>
                         <div className="flex items-center justify-end">
                           <FaTrophy className="text-primary" />
                         </div>
                       </div>
                       {/* Third Card */}
                       <div className="bg-white shadow-lg rounded-lg p-4 flex flex-row justify-around">
                         <div className='flex items-center justify-start'>
                           <p className="text-sm text-gray-700 mb-2"> 914 <br></br> Badges</p>
                           <p className="text-sm text-gray-500"></p>
                         </div>
                         <div className="flex items-center justify-end">
                           <FaMedal className="text-primary" />
                         </div>
                       </div>
                       {/* Fourth Card */}
                       <div className="bg-white shadow-lg rounded-lg p-4 flex flex-row justify-around">
                         <div className='flex items-center justify-start'>
                           <p className="text-sm text-gray-700 mb-2"> 1 <br></br> Expired Course</p>
                           <p className="text-sm text-gray-500"></p>
                         </div>
                         <div className="flex items-center justify-end">
                           <FaTrash className="text-primary" />
                         </div>
                       </div>
                     </div>
                   </div>
 
                 
               </div>
             </div>
         )}