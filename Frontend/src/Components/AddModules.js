import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBars,
  FaSun,
  FaMoon,
  FaBell,
  FaSearch,
  FaArrowLeft,
  FaPlus,
} from 'react-icons/fa';
import Adminsidenav from './Adminsidenav';
import user from '../Images/user.png';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const AddModules = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState('');
  const { courseId } = useParams();
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [modules, setModules] = useState([]);
  const [files, setFiles] = useState([]);
  const [editingModule, setEditingModule] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userData = jwt_decode(token)
      setUsername(userData.user.name)
    }

    const fetchModules = async () => {
      try {
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

          setModules(modulesWithFileDetails)
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

    

    fetchModules()
    
  }, [courseId])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

   // Import useParams

  const handleAddModule = async () => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', moduleName)
      formData.append('description', moduleDescription)
      files.forEach((file) => {
        formData.append('files', file) // Updated to append multiple files
      })

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/modules`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setModules([...modules, response.data])
      setModuleName('')
      setModuleDescription('')
      setFiles([]) // Reset the file input
      setShowModuleForm(false)
    } catch (err) {
      console.error('Error adding module:', err)
    }
  }




  const handleEditModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/modules/${editingModule._id}`,
        {
          name: moduleName,
          description: moduleDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModules(
        modules.map((module) =>
          module._id === editingModule._id ? response.data.module : module
        )
      );
      setModuleName('');
      setModuleDescription('');
      setEditingModule(null);
    } catch (err) {
      console.error('Error editing module:', err);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/modules/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModules(modules.filter((module) => module._id !== moduleId));
    } catch (err) {
      console.error('Error deleting module:', err);
    }
  };

  const startEditing = (module) => {
    setEditingModule(module);
    setModuleName(module.name);
    setModuleDescription(module.description);
  };
  
  const handleCreateNewTest = (moduleId) => {
    navigate(`/createnewtest?courseId=${courseId}&moduleId=${moduleId}`)
  }
   if (loading) {
     return <p>Loading modules...</p>
   }

   if (error) {
     return <p className='text-red-500'>{error}</p>
   }

  // if (loading) {
  //   return <p>Loading files...</p>
  // }

  // if (error) {
  //   return <p className='text-red-500'>{error}</p>
  // }

  // if (!module || !module.files || module.files.length === 0) {
  //   return <p>No files available for this module.</p>
  // }


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

        <div className='flex justify-between mb-4'>
          <button
            onClick={() => setShowModuleForm(!showModuleForm)}
            className='px-6 py-2 bg-primary text-white rounded-md'
          >
            Add Module
          </button>
        </div>
        {showModuleForm && (
          <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md mb-6'>
            <h2 className='text-xl font-bold text-primary mb-4'>Add Module</h2>
            <div className='space-y-4'>
              <input
                type='text'
                className='w-full p-2 border rounded-md'
                placeholder='Module Name'
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
              <textarea
                className='w-full p-2 border rounded-md'
                placeholder='Module Description'
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
              />
              <input
                type='file'
                className='w-full p-2 border rounded-md'
                onChange={(e) => setFiles(Array.from(e.target.files))} // Updated to handle multiple files
                name='files'
                multiple
              />

              <button
                onClick={handleAddModule}
                className='px-6 py-2 bg-primary text-white rounded-md'
              >
                Add Module
              </button>
            </div>
          </div>
        )}

        {editingModule !== null && (
          <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md mb-6'>
            <h2 className='text-xl font-bold text-primary mb-4'>
              {editingModule ? 'Edit Module' : 'Add Module'}
            </h2>
            <div className='space-y-4'>
              <input
                type='text'
                className='w-full p-2 border rounded-md'
                placeholder='Module Name'
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
              <textarea
                className='w-full p-2 border rounded-md'
                placeholder='Module Description'
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
              />
              {!editingModule && (
                <input
                  type='file'
                  className='w-full p-2 border rounded-md'
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  name='files'
                  multiple
                />
              )}
              <button
                onClick={editingModule ? handleEditModule : handleAddModule}
                className='px-6 py-2 bg-primary text-whiterounded-md'
              >
                {editingModule ? 'Update Module' : 'Add Module'}
              </button>
            </div>
          </div>
        )}

        <div className=' flex space-x-4 '>
          {modules.length > 0 ? (
            modules.map((module) => (
              <div key={module._id} className='p-4 border rounded-md shadow-md'>
                <h3 className='text-lg font-semibold'>{module.name}</h3>
                <p>{module.description}</p>
                <div className=' mt-2'>
                  {module.fileDetails.map((file, index) => (
                    <a
                      key={index}
                      href={`http://localhost:5000/${file.path}`}
                      download
                      className='block text-blue-500 underline'
                    >
                      {file.name}
                    </a>
                  ))}
                </div>
                {/* {module.fileDetails?.length > 0 ? (
                  
                ) : (
                  <p>No files available for this module</p>
                )} */}
                <div className='flex space-x-4 mt-4'>
                  <button
                    onClick={() => startEditing(module)}
                    className='px-6 py-2 bg-primary text-white rounded-md'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module._id)}
                    className='px-6 py-2 bg-primary text-white rounded-md'
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCreateNewTest(module._id)}
                    className=' px-6 py-2 bg-primary text-white rounded-md'
                  >
                    Add Test
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No modules available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddModules

