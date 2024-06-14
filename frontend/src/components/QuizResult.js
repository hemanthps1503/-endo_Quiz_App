import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuestions, correctAnswers, questions, userAnswers } = location.state || {
    totalQuestions: 0,
    correctAnswers: 0,
    questions: [],
    userAnswers: {}
  };
  const email = localStorage.getItem('email');
  const wrongAnswers = totalQuestions - correctAnswers;
  const [emailSent, setEmailSent] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/login');
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const sendEmail = () => {
    axios.post('https://endo-quiz-app.onrender.com/api/send-email', {
      email,
      totalQuestions,
      correctAnswers,
      wrongAnswers
    })
      .then(response => {
        console.log('Email sent:', response.data);
        setEmailSent(true);
        setConfirmEmail(false);
      })
      .catch(error => {
        console.error('Error sending email:', error);
        setEmailSent(false);
      });
  };

  const handleSendEmailConfirmation = (confirm) => {
    setConfirmEmail(false);
    if (confirm) {
      sendEmail();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReviewAnswers = () => {
    setShowReview(true);
  };

  const attendedData = {
    labels: ['Total Questions Attended', 'Total Questions Missed'],
    datasets: [{
      data: [totalQuestions, wrongAnswers],
      backgroundColor: ['#FFB400', '#E0E0E0'],
    }],
  };

  const correctData = {
    labels: ['Total Correct Answers', 'Total Questions Attended'],
    datasets: [{
      data: [correctAnswers, totalQuestions],
      backgroundColor: ['#00C853', '#E0E0E0'],
    }],
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Thank you for taking the test</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600">Your Report</h2>
      </div>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Questions Attended</h3>
          <Doughnut data={attendedData} />
          <p className="mt-4 text-gray-600">Total Questions: {totalQuestions}</p>
          <p className="text-gray-600">Total Questions Wrong: {wrongAnswers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Correct Answers</h3>
          <Doughnut data={correctData} />
          <p className="mt-4 text-gray-600">Total Correct Answers: {correctAnswers}</p>
          <p className="text-gray-600">Total Questions: {totalQuestions}</p>
        </div>
      </div>

      {confirmEmail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-700 mb-4">Do you want your test report sent to your email?</p>
            <div className="flex space-x-4 justify-center">
              <button onClick={() => handleSendEmailConfirmation(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Yes</button>
              <button onClick={() => handleSendEmailConfirmation(false)} className="bg-red-600 text-white px-4 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button onClick={handleReviewAnswers} className="bg-yellow-600 text-white px-4 py-2 rounded-lg mr-4">Review Answers</button>
        <button onClick={handleGoHome} className="bg-green-600 text-white px-4 py-2 rounded-lg mr-4">Go Home</button>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
      </div>

      {showReview && <ReviewAnswers questions={questions} userAnswers={userAnswers} setShowReview={setShowReview} />}

      {emailSent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-green-600 mb-4">Test report sent to your email successfully.</p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
              <button onClick={handleReviewAnswers} className="bg-yellow-600 text-white px-4 py-2 rounded-lg">Review Answers</button>
              <button onClick={handleGoHome} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Go Home</button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewAnswers = ({ questions, userAnswers, setShowReview }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{question.question}</p>
            <p>Your Answer: {userAnswers[index] || 'Not Answered'}</p>
            <p>Correct Answer: {question.correct_option}</p>
            <p className={`mt-1 ${userAnswers[index] === question.correct_option ? 'text-green-600' : 'text-red-600'}`}>
              {userAnswers[index] === question.correct_option ? 'Correct' : 'Incorrect'}
            </p>
          </div>
        ))}
        <button onClick={() => setShowReview(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">Close</button>
      </div>
    </div>
  );
};

export default QuizResult;
