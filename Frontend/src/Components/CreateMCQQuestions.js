import React, { useState } from 'react';

const CreateMCQQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleAddQuestion = () => {
    const newQuestionObject = {
      question: newQuestion,
      options: [...options],
      correctAnswer: correctAnswer,
    };
    setQuestions([...questions, newQuestionObject]);
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const handleEditQuestion = (index) => {
    setSelectedQuestionIndex(index);
    setNewQuestion(questions[index].question);
    setOptions([...questions[index].options]);
    setCorrectAnswer(questions[index].correctAnswer);
  };

  const handleUpdateQuestion = () => {
    if (selectedQuestionIndex !== null) {
      const updatedQuestionObject = {
        question: newQuestion,
        options: [...options],
        correctAnswer: correctAnswer,
      };
      const updatedQuestions = [...questions];
      updatedQuestions[selectedQuestionIndex] = updatedQuestionObject;
      setQuestions(updatedQuestions);
      setSelectedQuestionIndex(null);
      setNewQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handlePostTest = () => {
    setQuizStarted(true);
    setUserAnswers(new Array(questions.length).fill(''));
  };

  const handleAnswerChange = (index, answer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[index] = answer;
    setUserAnswers(updatedUserAnswers);
  };

  const renderQuiz = () => (
    <div>
      <h3 className="text-xl font-semibold mb-2">Quiz</h3>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-bold">{question.question}</h4>
          {question.options.map((option, optIndex) => (
            <div key={optIndex}>
              <label>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={userAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={() => console.log('User answers: ', userAnswers)}
        className="bg-green-500 text-white rounded-md px-4 py-2"
      >
        Submit Quiz
      </button>
    </div>
  );

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">MCQ Quiz Questions</h2>
      {quizStarted ? (
        renderQuiz()
      ) : (
        <div className="flex">
          {/* First main div for adding and editing questions */}
          <div className="w-1/2 pr-4">
            <h3 className="text-xl font-semibold mb-2">Add/Edit Question</h3>
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
              placeholder="Enter your question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full mb-2"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...options];
                  updatedOptions[index] = e.target.value;
                  setOptions(updatedOptions);
                }}
              />
            ))}
            <div className="flex items-center mb-2">
              <span className="mr-2">Correct Answer:</span>
              <select
                className="border border-gray-300 rounded-md p-2"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>{`Option ${index + 1}`}</option>
                ))}
              </select>
            </div>
            {selectedQuestionIndex === null ? (
              <button
                onClick={handleAddQuestion}
                className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2"
              >
                Add Question
              </button>
            ) : (
              <button
                onClick={handleUpdateQuestion}
                className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2"
              >
                Update Question
              </button>
            )}
          </div>
          {/* Second main div for displaying questions */}
          <div className="w-1/2 pl-4">
            <h3 className="text-xl font-semibold mb-2">Questions List</h3>
            <ul className="list-disc pl-4">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500 mb-2"
                  onClick={() => handleEditQuestion(index)}
                >
                  {question.question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!quizStarted && questions.length > 0 && (
        <button
          onClick={handlePostTest}
          className="bg-green-500 text-white rounded-md px-4 py-2 mt-4"
        >
          Post Test
        </button>
      )}
    </div>
  );
};

export default CreateMCQQuestions;
