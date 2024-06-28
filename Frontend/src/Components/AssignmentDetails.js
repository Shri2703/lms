import React, { useState } from 'react';
import { FaArrowLeft, FaBars, FaSearch, FaSun, FaMoon, FaBell, FaTachometerAlt, FaBook, FaUser, FaSignOutAlt, FaRegComments, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import navlogo from '../Images/navlogo.png';
import user from '../Images/user.png';
import Sidebar from './Sidenavbar'; 


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
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

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
          <div className="w-75 bg-gradient-to-r from-primary to-maroon-dark h-28  rounded-lg">
            <h2 className="text-2xl font-bold text-white p-8">Database Management System</h2>
            <div className="absolute top-4 right-4 flex items-center space-x-2 p-4">
              <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden ">
                <div className="bg-bar h-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-sm text-white">80% Completed</p>
            </div>
          </div>

          {/* Overlapping Boxes */}
          <div className="flex space-x-4 mb-4 ml-8 mr-2 mt-[-10px] ">
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Start Date:</p>
                                <p className=" text-bar text-sm">June 1, 2024</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">End Date:</p>
                                <p className=" text-bar text-sm">June 30, 2024</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Assessment:</p>
                                <p className="text-bar text-sm">24</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Test Date:</p>
                                <p className=" text-bar text-sm">July 15, 2024</p>
                                </div>
             </div>
        </div>

        {/* Additional Content */}
        <div className="flex flex-col md:flex-row   pt-7  space-y-6 md:space-y-0 md:space-x-6">
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
