import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const QuizInstructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz } = location.state;

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-400 to-purple-600 p-4 md:p-8">
      <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-purple-600">Quiz Instructions</h1>
        <p className="text-xl mb-4">You are about to start the <strong>{quiz.name}</strong> quiz.</p>
        <p className="text-lg mb-4">Total Questions: {quiz.total_questions}</p>
        <p className="text-lg mb-4">Points per Question: {quiz.points}</p>
        <p className="text-lg mb-4">Total Time: 30 seconds</p>
        <p className="text-lg mb-4">Mark for Review: You can mark questions to review them at the end of the test.</p>
        <p className="text-lg mb-4">Marked for Review questions will be displayed in <span style={{ color: 'blue' }}>blue</span> color.</p>
        <p className="text-lg mb-4"> Unmarked for Review questions will be displayed in <span style={{ color: 'green' }}>green</span> color.</p>
        <p className="text-lg mb-4"> Unanswered questions will be displayed in <span style={{ color: 'red' }}>red</span> color.</p>
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Instructions:</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Avoid using mobile phones or any other devices during the test.</li>
          <li>Do not refer to notes or textbooks while taking the quiz.</li>
          <li>Ensure a stable internet connection.</li>
          <li>Make sure you are in a quiet environment.</li>
          <li>Don't Navigate to other Window.</li>
        </ul>
        <div className="flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg mr-4 hover:bg-green-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={handleStartQuiz}
          >
            Continue to Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
