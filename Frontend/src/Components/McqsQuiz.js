import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaBars, FaSearch, FaSun, FaMoon, FaBell } from 'react-icons/fa'

import 'chart.js/auto'

import defaultimg from '../Images/defaultimg.jpg'
import Sidebar from './Sidenavbar'

const McqsQuiz = ({ username }) => {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [mcqs, setMcqs] = useState([])
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('course')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    if (!moduleId) {
      setError('Module ID is missing. Please select a module.')
      setLoading(false)
      return
    }

    const fetchMcqs = async () => {
      try {
        setLoading(true)

        // Fetch MCQ IDs
        const idsResponse = await axios.get(
          `http://localhost:5000/${moduleId}/mcqs`
        )
        if (idsResponse.data.success && Array.isArray(idsResponse.data.mcqs)) {
          const ids = idsResponse.data.mcqs

          // Fetch detailed MCQ data for each ID
          const mcqDetailsPromises = ids.map((id) =>
            axios.get(`http://localhost:5000/mcq/${id}`).then((res) => res.data)
          )
          const detailedMcqs = await Promise.all(mcqDetailsPromises)

          // Set MCQs and initialize answers
          setMcqs(detailedMcqs)
          setAnswers(new Array(detailedMcqs.length).fill(''))
        } else {
          setError(idsResponse.data.message || 'Failed to fetch MCQs.')
        }
      } catch (err) {
        setError(err.message || 'Error fetching MCQs.')
      } finally {
        setLoading(false)
      }
    }

    fetchMcqs()
  }, [moduleId])

  const handleAnswerChange = (index, selectedOption) => {
    const updatedAnswers = [...answers]
    updatedAnswers[index] = selectedOption
    setAnswers(updatedAnswers)
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/modules/${moduleId}/mcqs/submit`,
        { answers }
      )
      if (response.data.success) {
        setScore(response.data.score)
      } else {
        setError(response.data.message || 'Failed to submit answers.')
      }
    } catch (err) {
      setError(err.message || 'Error submitting answers.')
    }
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
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
            <img
              src={defaultimg}
              alt='Profile'
              className='w-10 h-10 rounded-full'
            />
            <div>
              <p className='text-primary'>{username}</p>
              <p className='text-sm text-dark'>Student</p>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-4'>Quiz for Module</h2>
          <button
            className='px-4 py-2 bg-gray-300 text-black rounded-md mb-4'
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </button>
          {Array.isArray(mcqs) && mcqs.length > 0 ? (
            mcqs.map((mcq, index) => (
              <div key={mcq._id} className='mb-4'>
                <h4 className='font-semibold'>{mcq.question}</h4>
                <div className='mt-2'>
                  {Array.isArray(mcq.options) &&
                    mcq.options.map((option, optionIndex) => (
                      <label key={optionIndex} className='block'>
                        <input
                          type='radio'
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => handleAnswerChange(index, option)}
                        />
                        {option}
                      </label>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p>No questions available for this module.</p>
          )}

          {score === null ? (
            <button
              className='px-4 py-2 bg-primary text-white rounded-md mt-4'
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>
                Your Score: {score} / {mcqs.length}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default McqsQuiz
