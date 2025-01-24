import React from 'react';
import { FaTachometerAlt, FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa';
import navlogo from '../Images/navlogo.png'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'


const Evaluatorsidenavbar = ({ isSidebarOpen, setIsSidebarOpen, currentSection, setCurrentSection }) => {
  const navigate = useNavigate() 
  const handleSignOut = () => {
    // Perform any necessary sign out logic, such as clearing tokens or user data
    // Redirect the user to the login page
    navigate('/login') // Adjust the route as needed for your app
  }
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 w-64 bg-white text-secondary transition-transform duration-300 ease-in-out z-30`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      <div className='flex items-center justify-center h-20 bg-white mt-4'>
        <img src={navlogo} alt='Profile' className='w-90 h-13' />
      </div>
      <nav className='flex flex-col flex-grow p-4'>
        <a
          href='#course'
          onClick={() => setCurrentSection('dashboard')}
          className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${
            currentSection === 'course' && 'bg-primary text-secondary'
          }`}
        >
          <FaTachometerAlt className='mr-3' />
          Course
        </a>
        <a
          href='#studentlist'
          onClick={() => setCurrentSection('course')}
          className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${
            currentSection === 'studentlist' && 'bg-primary text-secondary'
          }`}
        >
          <FaBook className='mr-3' /> student list
        </a>
        <a
          href='#scorecolumn'
          onClick={() => setCurrentSection('course')}
          className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${
            currentSection === 'scorecolumn' && 'bg-primary text-secondary'
          }`}
        >
          <FaBook className='mr-3' /> score column
        </a>
        <a
          href='#certification'
          onClick={() => setCurrentSection('course')}
          className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${
            currentSection === 'certification' && 'bg-primary text-secondary'
          }`}
        >
          <FaBook className='mr-3' /> Certification
        </a>
        <a
          href='#profile'
          onClick={() => setCurrentSection('profile')}
          className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${
            currentSection === 'profile' && 'bg-primary text-secondary'
          }`}
        >
          <FaUser className='mr-3' /> PROFILE
        </a>
      </nav>
      <div className='absolute bottom-0 left-0 w-full px-4'>
        <a
          id='signout-link'
          href='#signout-link' // Updated to prevent unwanted refresh
          onClick={handleSignOut} // Handle sign-out logic
          className='flex items-center block px-4 py-2 text-primary hover:bg-primary hover:text-secondary rounded'
        >
          <FaSignOutAlt className='mr-3' /> SIGN OUT
        </a>
      </div>
    </div>
  )
};

export default Evaluatorsidenavbar
