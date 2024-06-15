import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <QuizList username={username} /> : <Navigate to="/login" />} />
          <Route path="/quiz/:id" element={isAuthenticated ? <QuizDetails /> : <Navigate to="/login" />} />
          <Route path="/quiz-instructions" element={isAuthenticated ? <QuizInstructions /> : <Navigate to="/login" />} />
          <Route path="/result" element={isAuthenticated ? <QuizResult /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
