import React, { useState, useEffect } from 'react';
import './Setup.css';
import { useNavigate } from 'react-router-dom';

const Setup = ({ setQuizSettings }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: 10,
    category: 9,
    difficulty: 'easy'
  });

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(res => res.json())
      .then(data => setCategories(data.trivia_categories || []))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStart = () => {
    setQuizSettings(formData);
    navigate('/quiz'); 
  };

  return (
    <div className='container setup-card'>
      <h2>Customize Your Challenge</h2>
      <hr />
      
      <div className='settings-group'>
        <p>Select Difficulty</p>
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="">Any Difficulty</option>
        </select>
      </div>

      <div className='settings-group'>
        <p>Number of Questions</p>
        <input 
          type="number" name="amount" min="1" max="20" 
          value={formData.amount} onChange={handleChange} 
        />
      </div>

      <div className='settings-group'>
        <p>Select Category</p> 
        <select name="category" className="category-select" onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className='buttons'>
        <button className='start-btn' onClick={handleStart}>Start Quiz</button>
        <button className='start-btn' onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
  );
};

export default Setup;