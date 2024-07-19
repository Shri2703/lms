import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaSun, FaMoon, FaBell, FaSearch, FaArrowLeft, FaPlus } from 'react-icons/fa';
import Adminsidenav from './Adminsidenav'; 
import user from '../Images/user.png';
import CreateMCQQuestions from './CreateMCQQuestions';
import { jwtDecode as jwt_decode } from 'jwt-decode';


const AddModules = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [username, setUsername] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const { courseId } = useParams();
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [file, setFile] = useState(null);
    const [showModuleForm, setShowModuleForm] = useState(false);

    const handleAddModule = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', moduleName);
            formData.append('description', moduleDescription);
            if (file) {
                formData.append('files', file);
            }

            const response = await axios.post(`http://localhost:5000/api/modules/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setModules([...modules, response.data]);
            setModuleName('');
            setModuleDescription('');
            setFile(null);
            setShowModuleForm(false);
        } catch (err) {
            console.error('Error adding module:', err);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = jwt_decode(token);
            setUsername(userData.user.name);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCreateNewTest = () => {
        navigate('/createnewtest');
    };

    const renderSection = () => {
        if (selectedSection === 'MCQ') {
            return <CreateMCQQuestions handleBackClick={handleBackClick} />;
        } else if (selectedSection === 'Coding') {
            return (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Coding Section</h3>
                    <div>
                        {/* Add form fields or content for Coding */}
                    </div>
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-500 text-white rounded-md px-4 py-2"
                    >
                        Back
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-basic`}>
            <Adminsidenav 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                currentSection={'createNewTest'}
                setCurrentSection={() => {}}
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
                <button
                    className="flex items-center mb-4 px-3 py-2 border rounded text-primary border-gray-600 hover:text-primary hover:bg-secondary"
                    onClick={handleBackClick}
                >
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>

                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setShowModuleForm(!showModuleForm)}
                        className="px-6 py-2 bg-green-500 text-white rounded-md"
                    >
                        Add Module
                    </button>
                    <button
                        onClick={handleCreateNewTest}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Create New Test
                    </button>
                </div>

                {showModuleForm && (
                    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md mb-6">
                        <h2 className="text-xl font-bold text-primary mb-4">Add Module</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md"
                                placeholder="Module Name"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                            />
                            <textarea
                                className="w-full p-2 border rounded-md"
                                placeholder="Module Description"
                                value={moduleDescription}
                                onChange={(e) => setModuleDescription(e.target.value)}
                            />
                            <input
                                type="file"
                                className="w-full p-2 border rounded-md"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button
                                onClick={handleAddModule}
                                className="px-6 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Add Module
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {modules.map((module, index) => (
                        <div key={index} className="p-4 border rounded-md shadow-md">
                            <h3 className="text-lg font-semibold">{module.name}</h3>
                            <p>{module.description}</p>
                            {module.file && <a href={module.file} download>Download File</a>}
                        </div>
                    ))}
                </div>

                {renderSection()}
            </div>
        </div>
    );
};

export default AddModules;
