import React from 'react'
import { useState, useEffect } from 'react';
import './Leaderboard.css'
const Leaderboard = () => {
  const [currentCategory, setCurrentCategory] = useState('9'); 
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await fetch(`http://localhost:1500/api/leaderboard/${currentCategory}`);
      const data = await res.json();
      setScores(data);
    };
    fetchScores();
  }, [currentCategory]);

  return (
    <div className="bg-deep-purple min-h-screen p-6">
      <select 
        value={currentCategory} 
        onChange={(e) => setCurrentCategory(e.target.value)}
        className="quiz-select-dark w-full p-4 rounded-xl bg-white/5 text-white mb-8 border border-glass-border"
      >
        <option value="9">General Knowledge</option>
        <option value="21">Sports</option>
        <option value="17">Science</option>

      </select>

      {/* Render score list here */}
    </div>
  );
};

export default Leaderboard