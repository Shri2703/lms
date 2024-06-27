import React, { useState } from 'react';
import { FaArrowLeft, FaBars, FaSearch, FaSun, FaMoon, FaBell, FaTachometerAlt, FaBook, FaUser, FaSignOutAlt, FaRegComments, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import navlogo from '../Images/navlogo.png';
import user from '../Images/user.png';

const AssignmentDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard'); // State to track the current section

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basic`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-white text-secondary transition-transform duration-300 ease-in-out z-30`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="flex items-center justify-center h-20 bg-white mt-4">
          <img
            src={navlogo}
            alt="Profile"
            className="w-90 h-13"
          />
        </div>
        <nav className="flex flex-col flex-grow p-4">
          <a
            href="#dashboard"
            onClick={() => setCurrentSection('dashboard')}
            className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'dashboard' && 'bg-primary text-secondary'}`}
          >
            <FaTachometerAlt className="mr-3" /> Dashboard
          </a>
          <a
            href="#course"
            onClick={() => setCurrentSection('course')}
            className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'course' && 'bg-primary text-secondary'}`}
          >
            <FaBook className="mr-3" /> Course
          </a>
          <a
            href="#profile"
            onClick={() => setCurrentSection('profile')}
            className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'profile' && 'bg-primary text-secondary'}`}
          >
            <FaUser className="mr-3" /> Profile
          </a>
        </nav>
        <div className="absolute bottom-0 left-0 w-full px-4">
          <a
            href="#signout"
            onClick=""
            className="flex items-center block px-4 py-2 text-primary hover:bg-primary hover:text-secondary rounded"
          >
            <FaSignOutAlt className="mr-3" /> Sign Out
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-5 md:ml-4 relative">
        <button
          className="md:hidden flex items-center mb-4 px-3 py-2 border rounded text-primary border-gray-600 hover:text-primary hover:bg-secondary"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-14">
            <div className="relative">
              <FaSearch className="absolute top-3 left-4 text-primary" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-72 border rounded-full text-primary focus:outline-none focus:shadow-outline"
                placeholder="Search..."
              />
            </div>
            <FaBell className="text-primary hover:text-dark" />
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={toggleDarkMode} className="text-primary hover:text-dark">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <img
              src={user}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-primary">John Doe</p>
              <p className="text-sm text-dark">Student</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex items-center mb-6 cursor-pointer" onClick={handleBackClick}>
          <FaArrowLeft className="mr-2 text-primary" />
          <span className="text-primary">Back</span>
        </div>

        {/* Course Title with Gradient Background */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-maroon-700 h-52 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-white">DBMS</h2>
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-sm text-white">80% Completed</p>
            </div>
          </div>

          {/* Overlapping Boxes */}
          <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-around px-4">
            <div className="bg-white p-4 shadow-lg rounded-lg w-1/4">
              <h4 className="font-bold text-lg">Start Date</h4>
              <p>June 1, 2024</p>
            </div>
            <div className="bg-white p-4 shadow-lg rounded-lg w-1/4">
              <h4 className="font-bold text-lg">End Date</h4>
              <p>June 30, 2024</p>
            </div>
            <div className="bg-white p-4 shadow-lg rounded-lg w-1/4">
              <h4 className="font-bold text-lg">Assessment</h4>
              <p>24</p>
            </div>
            <div className="bg-white p-4 shadow-lg rounded-lg w-1/4">
              <h4 className="font-bold text-lg">Test Date</h4>
              <p>July 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <h3 className="font-bold text-xl">Additional Content 1</h3>
            <p className="mt-2 text-gray-700">Details about additional content 1.</p>
          </div>
          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <h3 className="font-bold text-xl">Additional Content 2</h3>
            <p className="mt-2 text-gray-700">Details about additional content 2.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
