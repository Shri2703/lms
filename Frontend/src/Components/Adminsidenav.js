import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { FiGrid, FiEdit, FiBarChart, FiUser } from 'react-icons/fi';
import navlogo from '../Images/navlogo.png'; // Adjust the import path as necessary

const Adminsidenav = ({ isSidebarOpen, setIsSidebarOpen, currentSection, setCurrentSection }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-72 bg-white text-secondary transition-transform duration-300 ease-in-out z-30`}
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
          id="course-link"
          href="#course-link"
          onClick={() => setCurrentSection('dashboard')}
          className={`flex items-center px-2 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'dashboard' && 'bg-primary text-secondary'}`}
        >
          <FiGrid className="mr-3" /> COURSE MANAGEMENT
        </a>
        <a
          id="evaluator-link"
          href="#evaluator-link"
          onClick={() => setCurrentSection('evaluator')}
          className={`flex items-center px-2 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'evaluator' && 'bg-primary text-secondary'}`}
        >
          <FiEdit className="mr-3" /> EVALUATOR MANAGEMENT
        </a>
        <a
          id="student-management-link"
          href="#student-management-link"
          onClick={() => setCurrentSection('studentmanagement')}
          className={`flex items-center px-2 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'studentmanagement' && 'bg-primary text-secondary'}`}
        >
          <FiBarChart className="mr-3" /> STUDENT MANAGEMENT
        </a>
        <a
          id="profile-link"
          href="#profile-link"
          onClick={() => setCurrentSection('profile')}
          className={`flex items-center px-2 py-2 mt-5 text-gray-700 hover:bg-primary hover:text-secondary rounded ${currentSection === 'profile' && 'bg-primary text-secondary'}`}
        >
          <FiUser className="mr-3" /> PROFILE
        </a>
      </nav>
      <div className="absolute bottom-0 left-0 w-full px-4">
        <a
          id="signout-link"
          href="#signout-link"
          onClick={() => console.log('Sign Out')}
          className="flex items-center block px-4 py-2 text-primary hover:bg-primary hover:text-secondary rounded"
        >
          <FaSignOutAlt className="mr-3" /> SIGN OUT
        </a>
      </div>
    </div>
  );
};

export default Adminsidenav;
