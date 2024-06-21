// src/AssignmentDetail.js
import { FaArrowLeft } from 'react-icons/fa';
import React, { useState } from 'react';
import { FaTachometerAlt, FaBook, FaUser, FaBars, FaSearch, FaSun, FaMoon, FaBell, FaSignOutAlt, FaRegComments, FaCalendarAlt, FaClock, FaBookmark, FaTrophy, FaMedal, FaTrash } from 'react-icons/fa';
import 'chart.js/auto';
import navlogo from '../Images/navlogo.png';
import user from '../Images/user.png'


const AssignmentDetail = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard'); // State to track the current section
  
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  const handleBackClick = () => {
    window.history.back(); // Navigate back to the previous page
  };
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleUpload = () => {
    // Perform upload logic here
    // Assuming upload is successful, set upload success state to true
    setIsUploadSuccess(true);
};

const handleReturnToDashboard = () => {
    // Redirect to student dashboard page
    window.location.href = '/student/dashboard';
};

  return (

    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}  bg-basic `}>
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
            className={`flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'course' && 'bg-primary text-secondary' }`}
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
            className=" flex items-center block px-4 py-2  text-primary hover:bg-primary hover:text-secondary rounded"
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

        {/* Conditional Rendering based on currentSection */}
        <div className="bg-transparent  rounded-lg p-3">
            <div className="flex items-center mb-4 space-x-2">
                <FaArrowLeft className="text-primary cursor-pointer" onClick={handleBackClick}  /> 
                <p className='text-bold text-primary text-lg'>
                    Back
                </p>
                
            </div>
            {/* <div className="w-75 bg-gradient-to-r from-maroon to-maroon-dark h-20 ml-4 rounded-lg"> 
              <h2 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold'>Assignment</h2>
            </div> */}
            {/* <div className="flex space-x-4 mb-4 ml-8 mr-2 mt-[-10px] ">
                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                <p className="text-sm">Start Date:</p>
                <p className=" text-dark text-sm">June 1, 2024</p>
                </div>
                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                <p className="text-sm">End Date:</p>
                <p className=" text-dark text-sm">June 30, 2024</p>
                </div>
                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                <p className="text-sm">Badge Earned:</p>
                <p className="text-dark text-sm">24</p>
                </div>
                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                <p className="text-sm">Test:</p>
                <p className=" text-dark text-sm">July 15, 2024</p>
                </div>
            </div> */}
            {isUploadSuccess ? (
                        <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-maroon to-maroon-dark">
                            <div className="bg-white shadow-md rounded-lg p-8 text-center">
                                <h2 className="text-xl font-bold text-primary mb-4">Success!</h2>
                                <p className="text-gray-700 mb-4">Documents have been uploaded successfully on time.</p>
                                <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleReturnToDashboard}>Return to Dashboard</button>
                            </div>
                        </div>
                    ) : (
                        /* Upload Assignment Section */
                        <div>
                            {/* Assignment details */}
                            <div className="w-75 bg-gradient-to-r from-maroon to-maroon-dark h-20 ml-4 rounded-lg">
                                <h2 className='flex justify-center p-4 text-white text-xl font-bold'>Assignment</h2>
                            </div>
                            <div className="flex space-x-4 mb-4 ml-8 mr-2 mt-[-10px] ">
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Start Date:</p>
                                <p className=" text-dark text-sm">June 1, 2024</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">End Date:</p>
                                <p className=" text-dark text-sm">June 30, 2024</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Badge Earned:</p>
                                <p className="text-dark text-sm">24</p>
                                </div>
                                <div className=" flex  space-x-2 bg-white text-primary p-4 rounded-lg flex-1">
                                <p className="text-sm">Test:</p>
                                <p className=" text-dark text-sm">July 15, 2024</p>
                                </div>
                            </div>

                            {/* Upload Assignment Card */}
                            <div className="bg-white shadow-md rounded-lg p-4 h-80 flex flex-col justify-center items-center">
                                <h3 className="text-lg font-bold text-primary mb-4">Upload Assignment</h3>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="w-full h-40 border-dashed border-2 border-gray-300 rounded-lg flex justify-center items-center cursor-pointer mb-4"
                                >
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="opacity-0 absolute w-full h-full cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-center text-gray-500">
                                        {file ? `File: ${file.name}` : 'Choose a file or drag and drop here'}
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-4 w-full">
                                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                                    <button className="bg-maroon text-white px-4 py-2 rounded" onClick={handleUpload}>Upload</button>
                                </div>
                            </div>
                        </div>
                    )}

        </div>
      </div>
    </div>
    
  );
};

export default AssignmentDetail;
