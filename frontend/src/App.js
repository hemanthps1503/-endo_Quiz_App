import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QuizList from './components/Quizlist';
import QuizInstructions from './components/QuizInstructions';
import QuizDetails from './components/QuizDetails';
import QuizResult from './components/QuizResult';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedUserId && storedToken) {
      axios.get('https://endo-quiz-app.onrender.com/api/validate-token', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(response => {
        if (response.data.valid) {
          setUsername(storedUser);
          setUserId(storedUserId);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
        setIsAuthChecked(true);
      })
      .catch(() => {
        handleLogout();
        setIsAuthChecked(true);
      });
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  const handleLogin = (name, id, token) => {
    setUsername(name);
    setUserId(id);
    setIsAuthenticated(true);
    localStorage.setItem('username', name);
    localStorage.setItem('userId', id);
    localStorage.setItem('token', token);
    toast.success('User logged in successfully!');
  };

  const handleLogout = () => {
    setUsername('');
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    toast.success('User logged out successfully!');
  };

  const location = useLocation();
  const shouldShowHeader = !(location.pathname.startsWith('/quiz/') || location.pathname === '/login' || location.pathname === '/register');

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      {shouldShowHeader && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white p-4 shadow flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">Øendo</div>
          {isAuthenticated && <button onClick={handleLogout} className="text-blue-600">Logout</button>}
        </div>
      )}
      <div className={shouldShowHeader ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <QuizList username={username} /> : <Navigate to="/login" />} />
          <Route path="/quiz/:id" element={isAuthenticated ? <QuizDetails /> : <Navigate to="/login" />} />
          <Route path="/quiz-instructions" element={isAuthenticated ? <QuizInstructions /> : <Navigate to="/login" />} />
          <Route path="/result" element={isAuthenticated ? <QuizResult /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
