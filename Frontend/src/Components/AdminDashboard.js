import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaSun, FaMoon, FaBell } from 'react-icons/fa';
import user from '../Images/user.png';
import Adminsidenav from './Adminsidenav';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard'); // State to track the current section

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basic`}>
      {/* Sidebar */}
      <Adminsidenav 
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
              <p className="text-primary">John Doe</p>
              <p className="text-sm text-dark">Student</p>
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on currentSection */}
        {currentSection === '#courselink' && (
          <div id="#courselink">
            <h2 className="text-xl font-bold text-primary mb-4">Dashboard Content</h2>
            {/* Add your dashboard content here */}
          </div>
        )}

        {currentSection === 'evalluatorlink' && (
          <div id="evalluatorlink">
            <h2 className="text-xl font-bold text-primary mb-4">Course Management Content</h2>
            {/* Add your course management content here */}
          </div>
        )}

        {currentSection === 'studentmanagement' && (
          <div id="studentmanagement">
            <h2 className="text-xl font-bold text-primary mb-4">Student Management Content</h2>
            {/* Add your student management content here */}
          </div>
        )}

        {currentSection === 'profile' && (
          <div id="profile">
            <h2 className="text-xl font-bold text-primary mb-4">Profile Content</h2>
            {/* Add your profile content here */}
            
          </div>
        )}

        {currentSection === 'signout' && (
          <div id="signout">
            <h2 className="text-xl font-bold text-primary mb-4">Sign Out Content</h2>
            {/* Add your sign out content here */}
              

              
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
