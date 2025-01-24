import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Adminsidenav from './Adminsidenav'
import { jwtDecode as jwt_decode } from 'jwt-decode'
import {
  FaBars,
  FaSun,
  FaMoon,
  FaBell,
  FaSearch,
  FaArrowLeft,
} from 'react-icons/fa'
import user from '../Images/user.png'
import CreateMCQQuestions from './CreateMCQQuestions'

const CreateNewTestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [username, setUsername] = useState('')
  const [selectedSection, setSelectedSection] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  // Extract the courseId and moduleId from the URL
  const queryParams = new URLSearchParams(location.search)
  const courseId = queryParams.get('courseId')
  const moduleId = queryParams.get('moduleId')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = jwt_decode(token)
      setUsername(userData.user.name)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const renderSection = () => {
    if (selectedSection === 'MCQ') {
      return (
        <CreateMCQQuestions
          moduleId={moduleId} // Pass moduleId as a prop
          handleBackClick={handleBackClick}
        />
      )
    } else if (selectedSection === 'Coding') {
      return (
        <div>
          <h3 className='text-lg font-semibold mb-4'>Coding Section</h3>
          <div>{/* Add form fields or content for Coding */}</div>
          <button
            onClick={handleBackClick}
            className='bg-gray-500 text-white rounded-md px-4 py-2'
          >
            Back
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basic`}>
      <Adminsidenav
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={'createNewTest'}
        setCurrentSection={() => {}}
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
        <button
          className='flex items-center mb-4 px-3 py-2 border rounded text-primary border-gray-600 hover:text-primary hover:bg-secondary'
          onClick={handleBackClick}
        >
          <FaArrowLeft className='mr-2' />
          Back
        </button>
        <h2 className='text-xl font-bold text-primary mb-4'>Create New Test</h2>
        <div className='mt-4 p-4 border rounded-md'>
          <h3 className='text-lg font-semibold mb-4'>Select Question Type</h3>
          <div className='space-y-4'>
            <button
              onClick={() => setSelectedSection('MCQ')}
              className={`px-6 py-2 ${
                selectedSection === 'MCQ' ? 'bg-primary ' : 'bg-gray-500'
              } text-white rounded-md mr-4`}
            >
              MCQ
            </button>
            <button
              onClick={() => setSelectedSection('Coding')}
              className={`px-6 py-2 ${
                selectedSection === 'Coding'
                  ? 'bg-primary '
                  : 'bg-gray-500'
              } text-white rounded-md`}
            >
              Coding
            </button>
          </div>
          <div className='mt-4'>{renderSection()}</div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewTestPage
