import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserResults = ({ userId }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://endo-quiz-app.onrender.com/api/users/${userId}/results`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => setResults(response.data))
      .catch(error => console.error('Error fetching results:', error));
  }, [userId]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">My Results</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Quiz Name</th>
            <th className="py-2">Total Questions</th>
            <th className="py-2">Score</th>
            <th className="py-2">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td className="py-2">{result.quiz_name}</td>
              <td className="py-2">{result.total_questions}</td>
              <td className="py-2">{result.score}</td>
              <td className="py-2">{result.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserResults;
