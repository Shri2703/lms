import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBars,
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
} from 'react-icons/fa'
import { Pie } from 'react-chartjs-2'
import GaugeChart from 'react-gauge-chart'
import 'chart.js/auto'
import navlogo from '../Images/navlogo.png'
import banner from '../Images/profilebanner.png'
import user from '../Images/user.png'
import defaultimg from '../Images/defaultimg.jpg'
import Sidebar from './Sidenavbar'
import { jwtDecode as jwt_decode } from 'jwt-decode'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Evaluatorsidenavbar from './Evaluatorsidenavbar'

const Evaluatordashboard = ({}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('dashboard') // State to track the current section
  const [username, setUsername] = useState('')
  const [studentData, setStudentData] = useState(null)
  const [selectedModules, setSelectedModules] = useState(null)
  const { studentId } = useParams()
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }
  const navigate = useNavigate()

  const handleDBMSClick = () => {
    navigate('/assignmentDetails')
  }

  const handleAssignmentClick = () => {
    navigate('/assignmentUpload')
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = jwt_decode(token)
      setUsername(userData.user.name)
    }
    if (!studentId) {
      setError('Invalid student ID')
      return
    }

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/${studentId}`
        )
        setStudentData(response.data.student)
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching student data')
      }
    }

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
    fetchStudentData()
  }, [studentId])

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

  const handleViewModules = async (courseId) => {
    try {
      if (selectedCourseId === courseId) {
        // If the same course is clicked again, toggle visibility
        setSelectedModules(null)
        setSelectedCourseId(null)
        return
      }

      setLoading(true) // Optional: Show a loading spinner during API call
      const response = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/modules`
      )

      if (response.data.success) {
        const modulesWithFileDetails = await Promise.all(
          response.data.modules.map(async (module) => {
            const fileDetails = await Promise.all(
              module.files.map(async (fileId) => {
                const fileResponse = await axios.get(
                  `http://localhost:5000/${fileId}`
                )
                return fileResponse.data.file
              })
            )

            return {
              ...module,
              fileDetails, // Add detailed file information to the module
            }
          })
        )

        setSelectedModules(modulesWithFileDetails)
        setSelectedCourseId(courseId) // Track the currently selected course
      } else {
        throw new Error('Failed to fetch modules')
      }
    } catch (err) {
      console.error('Error fetching modules:', err)
      setError('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}  `}>
      {/* Sidebar */}
      <Evaluatorsidenavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Content */}
      <div className='flex-grow p-5 md:ml-4 '>
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
              src={defaultimg}
              alt='Profile'
              className='w-10 h-10 rounded-full'
            />
            <div>
              <p className='text-primary'>{username}</p>
              <p className='text-sm text-dark'>Evaluator</p>
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on currentSection */}
        {currentSection === 'dashboard' && (
          <div id='dashboard'>
            {/* Banner and Profile Card */}
            
          </div>
        )}

        <div>
          {currentSection === 'course' && (
            <div id='course'>
              <h2 className='text-xl font-bold text-primary mb-4'>
                Course Content
              </h2>

              
              

              {/* Display selected modules */}
              
            </div>
          )}
        </div>

        {currentSection === 'profile' && (
          <div id='profile'>
            {/* Add your profile information here */}
            <div className='bg-transparent rounded-lg overflow-hidden'>
              <div
                className='bg-cover bg-center h-20'
                style={{ backgroundImage: `url(${banner})` }}
              ></div>
              <div className='bg-white text-primary p-2 mx-4 mt-[-10px] rounded-lg shadow-md text-sm font-bold '>
                <p className='text-center '>
                  College: XYZ University &nbsp;|&nbsp; Degree: B.Sc. Computer
                  Science &nbsp;|&nbsp; Semester: 4 &nbsp;|&nbsp; Batch:
                  2022-2024
                </p>
              </div>

              <div className='flex mt-8 space-x-8 px-4'>
                {/* Personal Information */}
                <div className='bg-white rounded-lg shadow-lg p-8 flex-0'>
                  <div className='flex items-center mb-4 space-x-8'>
                    <img
                      src={user}
                      alt='Profile'
                      className='w-16 h-16 rounded-lg mr-4'
                    />
                    <div>
                      <h3 className='text-lg font-bold text-primary'>
                        {username}
                      </h3>
                      <p className='text-sm text-gray-600'>Evalutor</p>
                    </div>
                  </div>
                  <h2 className='flex jusity-left text-dark font-bold '>
                    Personal Information
                  </h2>
                  <br></br>
                  <div className='mb-2 flex jusity-left'>
                    <span className='text-dark  '>Roll No:</span>
                    <span className='text-primary ml-12'>123456</span>
                  </div>
                  <div className='mb-2 flex jusity-left'>
                    <span className='text-dark '>Email:</span>
                    <span className='text-primary ml-12'>
                      {username}@gmail.com
                    </span>
                  </div>
                  <div className='mb-2 flex jusity-left'>
                    <span className='text-dark '>Phone:</span>
                    <span className='text-primary ml-12'>+1234567890</span>
                  </div>
                  <div className='mb-2 flex jusity-left'>
                    <span className='text-dark '>Gender:</span>
                    <span className='text-primary ml-12'>Male</span>
                  </div>
                  <div className='mb-2 flex jusity-left'>
                    <span className='text-dark '>Date Of Birth:</span>
                    <span className='text-primary ml-3'>January 1, 2000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Evaluatordashboard
