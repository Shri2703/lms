import React, { useState } from 'react'
import axios from 'axios'

const CreateMCQQuestions = ({ moduleId }) => {
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])

  const handleAddQuestion = async () => {
  const newQuestionObject = {
    question: newQuestion,
    options: [...options],
    correctAnswer: correctAnswer, // Send the correct answer directly as per the API response structure
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/api/modules/${moduleId}/mcqs`,
      { mcqs: [newQuestionObject] } // Payload matches backend expectations
    )

    if (response.data.success) {
      console.log('Question added:', response.data.mcqs)

      // Update the local questions state with the newly added question from the response
      setQuestions((prevQuestions) => [...prevQuestions, ...response.data.mcqs])
      setNewQuestion('')
      setOptions(['', '', '', ''])
      setCorrectAnswer('')
    } else {
      console.error('Failed to add question:', response.data.message)
    }
  } catch (error) {
    console.error('Error adding question:', error.response?.data || error.message)
  }
}

const handleUpdateQuestion = async () => {
  if (selectedQuestionIndex !== null) {
    const updatedQuestionObject = {
      question: newQuestion,
      options: [...options],
      correctAnswer: correctAnswer, // Update the correct answer field as per the API
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/modules/mcqs/${questions[selectedQuestionIndex]._id}`,
        updatedQuestionObject
      )

      if (response.data.success) {
        console.log('Question updated:', response.data.mcq)

        // Update the specific question in the local questions state
        setQuestions((prevQuestions) =>
          prevQuestions.map((q, index) =>
            index === selectedQuestionIndex ? response.data.mcq : q
          )
        )
        setSelectedQuestionIndex(null)
        setNewQuestion('')
        setOptions(['', '', '', ''])
        setCorrectAnswer('')
      } else {
        console.error('Failed to update question:', response.data.message)
      }
    } catch (error) {
      console.error('Error updating question:', error.response?.data || error.message)
    }
  }
}

const handleDeleteQuestion = async (index) => {
  try {
    const questionId = questions[index]._id // Get the specific question ID
    const response = await axios.delete(
      `http://localhost:5000/api/modules/mcqs/${questionId}`
    )

    if (response.data.success) {
      console.log('Question deleted:', response.data.message)

      // Remove the deleted question from the local state
      setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index))
    } else {
      console.error('Failed to delete question:', response.data.message)
    }
  } catch (error) {
    console.error('Error deleting question:', error.response?.data || error.message)
  }
}



  const handleEditQuestion = (index) => {
    setSelectedQuestionIndex(index)
    setNewQuestion(questions[index].question)
    setOptions([...questions[index].options])
    setCorrectAnswer(
      questions[index].options[questions[index].correctAnswerIndex]
    )
  }

  

  

  const handlePostTest = () => {
    setQuizStarted(true)
    setUserAnswers(new Array(questions.length).fill(''))
  }

  const handleAnswerChange = (index, answer) => {
    const updatedUserAnswers = [...userAnswers]
    updatedUserAnswers[index] = answer
    setUserAnswers(updatedUserAnswers)
  }

  const handleSubmitQuiz = () => {
    let score = 0
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
        score++
      }
    }
    alert(`Quiz completed! Your score: ${score} out of ${questions.length}`)
  }

  return (
    <div>
      {!quizStarted ? (
        <div>
          <h3 className='text-lg font-semibold mb-4'>MCQ Section</h3>
          <div className='mb-4'>
            <label className='block text-primary font-bold mb-2'>
              Question:
            </label>
            <input
              type='text'
              className='border rounded-md px-4 py-2 w-full'
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-primary font-bold mb-2'>
              Options:
            </label>
            {options.map((option, index) => (
              <div key={index} className='flex items-center mb-2'>
                <input
                  type='text'
                  className='border rounded-md px-4 py-2 w-full'
                  value={option}
                  onChange={(e) =>
                    setOptions(
                      options.map((opt, i) =>
                        i === index ? e.target.value : opt
                      )
                    )
                  }
                />
                <button
                  className='ml-2 px-3 py-1 bg-primary text-white rounded-md'
                  onClick={() =>
                    setOptions(options.filter((opt, i) => i !== index))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className='mt-2 px-4 py-2 bg-gray-500 text-white rounded-md'
              onClick={() => setOptions([...options, ''])}
            >
              Add Option
            </button>
          </div>
          <div className='mb-4'>
            <label className='block text-primary font-bold mb-2'>
              Correct Answer:
            </label>
            <select
              className='border rounded-md px-4 py-2 w-full'
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value=''>Select Correct Answer</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className='flex space-x-4'>
            <button
              className='bg-primary text-white rounded-md px-4 py-2'
              onClick={
                selectedQuestionIndex === null
                  ? handleAddQuestion
                  : handleUpdateQuestion
              }
            >
              {selectedQuestionIndex === null
                ? 'Add Question'
                : 'Update Question'}
            </button>
            {selectedQuestionIndex !== null && (
              <button
                className='bg-red-500 text-white rounded-md px-4 py-2'
                onClick={() => {
                  setSelectedQuestionIndex(null)
                  setNewQuestion('')
                  setOptions(['', '', '', ''])
                  setCorrectAnswer('')
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <div className='mt-4'>
            {questions.map((q, index) => (
              <div key={index} className='mb-4'>
                <div className='font-bold text-primary'>{q.question}</div>
                <ul className='ml-4 list-disc'>
                  {q.options.map((option, i) => (
                    <li key={i} className='text-primary'>
                      {option}
                    </li>
                  ))}
                </ul>
                <div className='mt-2 flex space-x-2'>
                  <button
                    className='px-3 py-1 bg-gray-500 text-white rounded-md'
                    onClick={() => handleEditQuestion(index)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-3 py-1 bg-red-500 text-white rounded-md'
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className='bg-gray-500 text-white rounded-md px-4 py-2 mt-4'
            onClick={handlePostTest}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div>
          <h3 className='text-lg font-semibold mb-4'>MCQ Quiz</h3>
          {questions.map((q, index) => (
            <div key={index} className='mb-4'>
              <div className='font-bold text-primary'>{q.question}</div>
              <div className='ml-4'>
                {q.options.map((option, i) => (
                  <label key={i} className='block text-primary'>
                    <input
                      type='radio'
                      name={`question-${index}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            className='bg-blue-500 text-white rounded-md px-4 py-2 mt-4'
            onClick={handleSubmitQuiz}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateMCQQuestions
