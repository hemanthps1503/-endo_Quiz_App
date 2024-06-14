import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`https://endo-quiz-app.onrender.com/api/quizzes/${id}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => setQuestions(response.data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, [id]);

  const handleOptionChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: event.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      checkUnansweredQuestions();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResult = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (question.correct_option === answers[index]) {
        correctAnswers++;
      }
    });
    navigate('/result', {
      state: { totalQuestions: questions.length, correctAnswers, questions, userAnswers: answers },
    });
  };

  const checkUnansweredQuestions = () => {
    const unanswered = questions.some((_, index) => !answers[index]);
    if (unanswered) {
      setShowWarning(true);
    } else {
      calculateResult();
    }
  };

  const endRound = () => {
    checkUnansweredQuestions();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100">
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4">
        <div className="relative flex items-center space-x-4">
          {currentQuestionIndex > 0 && (
            <button
              className="bg-blue-600 text-white p-2 rounded-full"
              onClick={handlePrevious}
            >
              &#8592;
            </button>
          )}
          <button
            className="bg-blue-600 text-white p-2 rounded-full"
            onClick={toggleMenu}
          >
            &#x2630;
          </button>
          {isMenuOpen && (
            <div className="absolute left-0 top-12 bg-white shadow-lg rounded mt-2 w-56 z-10">
              <ul className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <li
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectQuestion(index)}
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border rounded-full">
                      {index + 1}
                    </span>
                    <div className="ml-2 flex-grow">
                      <span className="block font-medium">MCQ {index + 1}</span>
                      <span className="block text-gray-500 text-sm">
                        5 Points
                      </span>
                    </div>
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded-full ml-2 ${
                        answers[index] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    ></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          className="bg-red-600 text-white p-2 rounded-full"
          onClick={endRound}
        >
          End round
        </button>
      </div>
      <div className="flex flex-1 space-x-4">
        <div className="w-1/2 p-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="mb-4">{questions[currentQuestionIndex]?.question}</p>
        </div>
        <div className="w-1/2 p-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Select One Of The Following Options.
          </h3>
          <ul className="list-none space-y-4">
            {['option1', 'option2', 'option3', 'option4'].map((option) => (
              <li
                key={option}
                className="flex items-center p-4 border rounded-lg"
              >
                <input
                  type="radio"
                  value={questions[currentQuestionIndex]?.[option]}
                  onChange={handleOptionChange}
                  name="option"
                  className="form-radio h-5 w-5 text-blue-600"
                  checked={
                    answers[currentQuestionIndex] ===
                    questions[currentQuestionIndex]?.[option]
                  }
                />
                <span className="ml-2">
                  {questions[currentQuestionIndex]?.[option]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-4">
        <div className="flex justify-between items-center w-full bg-white p-4 rounded-lg shadow-lg">
          {currentQuestionIndex > 0 && (
            <button
              className="bg-blue-600 text-white p-2 rounded-full"
              onClick={handlePrevious}
            >
              &#8592; Previous
            </button>
          )}
          <button
            className="bg-yellow-400 text-white p-2 rounded-full"
            onClick={handleNext}
          >
            {currentQuestionIndex === questions.length - 1
              ? 'Finish'
              : 'Save & Next'}{' '}
            &#8594;
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              You have some unanswered questions.
            </h2>
            <p className="mb-6">Please check the menu bar notifications.</p>
            <div className="flex justify-around">
              <button
                className="bg-gray-200 p-2 rounded-full"
                onClick={() => setShowWarning(false)}
              >
                Go Back
              </button>
              <button
                className="bg-red-600 text-white p-2 rounded-full"
                onClick={calculateResult}
              >
                End Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
