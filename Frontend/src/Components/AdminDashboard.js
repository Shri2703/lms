import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaSun, FaMoon, FaBell, FaArrowDown } from 'react-icons/fa';
import user from '../Images/user.png';
import Adminsidenav from './Adminsidenav';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  const [courses, setCourses] = useState([]);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleCourseDetails = (course) => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [course]: !prevDetails[course],
    }));
  };

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/courses', newCourse, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setCourses([...courses, response.data]);
      setShowAddCourseForm(false);
      setNewCourse({ title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = jwt_decode(token);
      setUsername(userData.user.name);
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allcourses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateNewTest = () => {
    navigate('/createnewtest');
  };

  const handleAddModule = (courseId) => {
    navigate(`/addmodules/${courseId}`);
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basi`}>
      <Adminsidenav 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
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
              <p className="text-sm text-dark">Admin</p>
            </div>
          </div>
        </div>
        {currentSection === 'dashboard' && (
          <div id="course-link">
            <h2 className="text-xl font-bold text-primary mb-4">Course Management</h2>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <p>{course.description}</p>
                    </div>
                    <button
                      onClick={() => toggleCourseDetails(course.title)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      View More
                    </button>
                  </div>
                  {courseDetails[course.title] && (
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleAddModule(course._id)} 
                          className="px-6 py-2 bg-gray-500 text-white rounded-md"
                        >
                          Add Module
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                  className="px-6 py-2 bg-green-500 text-white rounded-md"
                >
                  Add Course
                </button>
              </div>
              {showAddCourseForm && (
                <div className="mt-4 p-4 border rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Course Title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Course Description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    />
                    <button
                      onClick={handleAddCourse}
                      className="px-6 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Add Course
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {currentSection === 'evaluator' && (
          <div id="evaluator-link">
            <h2 className="text-xl font-bold text-primary mb-4">Evaluator Management Content</h2>
            {/* Add your evaluator management content here */}
          </div>
        )}
        {currentSection === 'studentmanagement' && (
          <div id="student-management-link">
            <h2 className="text-xl font-bold text-primary mb-4">Student Management Content</h2>
            {/* Add your student management content here */}
          </div>
        )}
        {currentSection === 'profile' && (
          <div id="profile-link">
            <h2 className="text-xl font-bold text-primary mb-4">Profile Content</h2>
            {/* Add your profile content here */}
          </div>
        )}
        {currentSection === 'signout' && (
          <div id="signout-link">
            <h2 className="text-xl font-bold text-primary mb-4">Sign Out Content</h2>
            {/* Add your sign out content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;