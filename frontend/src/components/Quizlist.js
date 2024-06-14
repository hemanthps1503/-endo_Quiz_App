import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizList = ({ username }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Fetching quizzes with token:', token);
      axios.get('http://localhost:5000/api/quizzes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Quizzes fetched successfully:', response.data);
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
      });
    } else {
      console.log('No token found');
    }
  }, []);

  const handleStartQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-400 to-purple-600 p-4 md:p-8">
      <div className="w-full md:w-1/5 bg-white p-4 border-r border-gray-300 rounded-2xl shadow-lg mb-4 md:mb-0 md:mr-8">
        {username && (
          <div className="flex items-center space-x-2 mb-4">
            {/* Removed the logo for a cleaner look */}
          </div>
        )}
        <div
          className={`flex items-center space-x-2 cursor-pointer ${showQuizzes ? 'text-blue-600' : ''}`}
          onClick={() => setShowQuizzes(!showQuizzes)}
        >
          <div className={`flex items-center space-x-2 ${showQuizzes ? 'text-blue-600' : ''}`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 13h16v-2H4v2zm0 5h16v-2H4v2zm0-10h16V6H4v2z"></path>
            </svg>
            <div className="text-xl font-bold">Tests</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white p-4 md:p-8 rounded-2xl shadow-lg">
        {showQuizzes ? (
          <>
            <h1 className="text-3xl font-semibold mb-6 text-purple-600">Welcome, {username}!</h1>
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-xl shadow mb-4 flex justify-between items-center quiz-item transform transition duration-300 ease-in-out hover:bg-orange-500 hover:scale-105"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">{quiz.name}</h2>
                  <p className="text-white">Total Questions: {quiz.total_questions}</p>
                  <p className="text-white">Points: {quiz.points}</p>
                </div>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:bg-purple-800"
                  onClick={() => handleStartQuiz(quiz.id)}
                >
                  Solve Challenge
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center bg-gradient-to-r from-green-400 to-blue-400 p-8 rounded-2xl shadow quiz-container">
            <h1 className="text-4xl font-bold text-white mb-4">Take Quiz and Test Your Knowledge!</h1>
            <p className="text-xl text-white mb-4">Challenge yourself and see how much you know.</p>
            <p className="text-lg text-gray-100 italic">"The beautiful thing about learning is that nobody can take it away from you." - B.B. King</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
