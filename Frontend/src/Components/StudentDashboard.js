import React, { useState,  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaUser, FaBars, FaSearch, FaSun, FaMoon, FaBell, FaSignOutAlt, FaRegComments, FaCalendarAlt, FaClock, FaBookmark, FaTrophy, FaMedal, FaTrash } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import 'chart.js/auto';
import navlogo from '../Images/navlogo.png';
import banner from '../Images/profilebanner.png';
import user from '../Images/user.png'
import Sidebar from './Sidenavbar';
import { jwtDecode as jwt_decode } from 'jwt-decode';



const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard'); // State to track the current section
  const [username, setUsername] = useState('');

  

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  const navigate = useNavigate();

  const handleDBMSClick = () => {
    navigate('/assignmentDetails');
  };
  

  const handleAssignmentClick = () => {
    navigate('/assignmentUpload');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = jwt_decode(token);
      setUsername(userData.user.name);
    }
  }, []);
  
  

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}  bg-basic `}>
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Content */}
      <div className="flex-grow p-5 md:ml-4">
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
              <p className="text-primary">{username}</p>
              <p className="text-sm text-dark">Student</p>
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on currentSection */}
        {currentSection === 'dashboard' && (
          <div id="dashboard">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white p-2 rounded-lg w-35">
                <div className="flex space-x-5">
                  <button
                    onClick={() => setCurrentSection('dashboard')}
                    className={`px-4 py-2 w-full rounded-lg ${currentSection === 'dashboard' ? 'bg-primary text-secondary' : 'bg-secondary text-primary'} hover:bg-primary hover:text-secondary`}
                  >
                    Skill
                  </button>
                  <button
                    onClick={() => setCurrentSection('course')}
                    className={`px-4 py-2 w-full rounded-lg ${currentSection === 'course' ? 'bg-primary text-secondary' : 'bg-secondary text-primary'} hover:bg-primary hover:text-secondary`}
                  >
                    Course
                  </button>
                </div>
              </div>
            </div>



            {/* Banner and Profile Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-cover bg-center h-20" style={{ backgroundImage: `url(${banner})` }}></div>
              <div className="p-4">
                <div className="flex items-center space-x-4 -mt-12">
                  <img
                    src={user}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-white"
                  />
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <p className="text-lg font-bold text-primary">{username}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <p className="text-sm text-gray-800">{username}@gmail.com</p>
                </div>

                <div className="flex items-center space-x-14 mt-4">
                  <div className="text-sm text-gray-800">
                    <span className="font-bold text-primary">Roll Number: </span>123456
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="font-bold text-primary">Degree: </span>B.Tech
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="font-bold text-primary">Batch: </span>2021
                  </div>
                  <div className="text-sm text-gray-800">
                    <span className="font-bold text-primary">College: </span>ABC University
                  </div>
                </div>
              </div>
            </div>

            {/* Performance and Upcoming Events */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Overall Performance */}
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Performance</h2>
                <div className="flex items-center justify-center">
                  <GaugeChart
                    id="gauge-chart1"
                    nrOfLevels={30} // Number of color segments in the arc
                    percent={0.75} // Fill 75% of the gauge
                    colors={['#FF5F6D', '#FFC371']} // Colors for the gauge
                    arcWidth={0.2} // Width of the gauge arc
                    arcPadding={0.02} // Space between each color segment
                    cornerRadius={3} // Radius for rounded corners
                    textColor="#000000" // Color for the text
                    style={{ width: '100%' }} // Ensure full width
                    needleColor="#464A4F" // Color of the needle
                  />
                </div>
              </div>
              {/* Solved Questions */}
              <div className="bg-white shadow-lg rounded-lg p-4 w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Solved Questions</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-1/3">
                    <Pie
                      data={{
                        labels: ['Assigned Course', 'Completed Course', 'pending Course'],
                        datasets: [
                          {
                            data: [50, 30, 20],
                            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false, // Hide the labels
                          },
                        },
                      }}
                      width={200} // Increase the width to make the chart bigger
                      height={200} // Increase the height to make the chart bigger
                    />
                  </div>
                  <div className="w-1/3 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-green-500 mr-2"></span>
                      <span className="text-primary">Assigned Course </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-yellow-500 mr-2"></span>
                      <span className="text-primary">Completed Course</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-red-500 mr-2"></span>
                      <span className="text-primary">pending Course</span>
                    </div>
                  </div>
                  <div className="w-1/3 flex flex-col">
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-green-500 mr-2"></span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="ml-2 text-primary">50%</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-yellow-500 mr-2"></span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="ml-2 text-primary">30%</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="block w-4 h-4 bg-red-500 mr-2"></span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="ml-2 text-primary">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {currentSection === 'profile' && (
          <div id="profile">
            {/* Add your profile information here */}
            <div className="bg-transparent rounded-lg overflow-hidden">
              <div className="bg-cover bg-center h-20" style={{ backgroundImage: `url(${banner})` }}></div>
              <div className="bg-white text-primary p-2 mx-4 mt-[-10px] rounded-lg shadow-md text-sm font-bold ">
              <p className="text-center ">
                College: XYZ University &nbsp;|&nbsp; Degree: B.Sc. Computer Science &nbsp;|&nbsp; Semester: 4 &nbsp;|&nbsp; Batch: 2022-2024
              </p>

              </div>

              <div className="flex mt-8 space-x-8 px-4">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-lg p-8 flex-0">
                  <div className="flex items-center mb-4 space-x-8">
                    <img src={user} alt="Profile" className="w-16 h-16 rounded-lg mr-4" />
                    <div>
                      <h3 className="text-lg font-bold text-primary">{username}</h3>
                      <p className="text-sm text-gray-600">Student</p>
                    </div>
                  </div>
                  <h2 className='flex jusity-left text-dark font-bold '>Personal Information</h2><br></br>
                  <div className="mb-2 flex jusity-left">
                    <span className="text-dark  ">Roll No:</span>
                    <span className="text-primary ml-12">123456</span>
                  </div>
                  <div className="mb-2 flex jusity-left">
                    <span className="text-dark ">Email:</span>
                    <span className="text-primary ml-12">{username}@gmail.com</span>
                  </div>
                  <div className="mb-2 flex jusity-left">
                    <span className="text-dark ">Phone:</span>
                    <span className="text-primary ml-12">+1234567890</span>
                  </div>
                  <div className="mb-2 flex jusity-left">
                    <span className="text-dark ">Gender:</span>
                    <span className="text-primary ml-12">Male</span>
                  </div>
                  <div className="mb-2 flex jusity-left">
                    <span className="text-dark ">Date Of Birth:</span>
                    <span className="text-primary ml-3">January 1, 2000</span>
                  </div>
                </div>

                {/* Academic Information */}
                {/* <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                    <h3 className="text-lg font-bold text-dark mb-2">Academic Information</h3>
                    <table className="min-w-full text-sm text-left text-gray-700">
                      <tbody>
                        <tr>
                          <th className="font-bold text-primary">10th:</th>
                          <td className="text-dark">90%</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">12th:</th>
                          <td className="text-dark">85%</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">Diploma:</th>
                          <td className="text-dark">NA</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">Undergraduate:</th>
                          <td className="text-dark">3.8 GPA</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">Postgraduate:</th>
                          <td className="text-dark">NA</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">Backlog History:</th>
                          <td className="text-dark">None</td>
                        </tr>
                        <tr>
                          <th className="font-bold text-primary">Current Backlogs:</th>
                          <td className="text-dark">None</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-bold text-dark mb-2">Resume Upload</h3>
                    <input type="file" className="mb-2" />
                    <button className="bg-primary text-white py-1 px-4 rounded">Replace</button>
                  </div>
                </div> */}



              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default StudentDashboard;
