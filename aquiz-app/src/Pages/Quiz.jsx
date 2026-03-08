import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';
import Higuruma from '../assets/Higuruma.png'
import Hesnotreading from '../assets/Not-reading.png'
import Regret from '../assets/Regret.png'
import doesheknow from '../assets/doesheknow.png'
import speed from '../assets/speed.jpg'

const Quiz = ({ category, amount, difficulty }) => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem('active_quiz');
    return saved ? JSON.parse(saved).index : 0;
});
    const [data, setData] = useState(() => {
    const saved = localStorage.getItem('active_quiz');
    return saved ? JSON.parse(saved).data : [];
});
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [quizSettings, setQuizSettings] = useState(() => {
    const saved = localStorage.getItem('active_quiz');
    if (saved) {
        return JSON.parse(saved).quizSettings;
    }
    return { amount: 10, category: 9, difficulty: 'easy' };
});

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);
    const option_array = [Option1, Option2, Option3, Option4];

    useEffect(() => {
    // If we already have data (from localStorage), just stop loading and don't fetch!
    if (data.length > 0) {
        setLoading(false);
        return; 
    }

    let isMounted = true;
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}${difficulty ? `&difficulty=${difficulty}` : ''}&type=multiple`;

    const timer = setTimeout(() => {
        fetch(url)
            .then(res => {
                if (res.status === 429) throw new Error("Rate Limited");
                return res.json();
            })
            .then(resData => {
                if (isMounted && resData?.results) {
                    const formatted = resData.results.map(q => ({
                        ...q,
                        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
                    }));
                    setData(formatted);
                    setLoading(false);
                }
            })
            .catch(err => console.log("API is chilling..."));
    }, 1000);

    return () => {
        isMounted = false;
        clearTimeout(timer);
    }; 
}, [amount, category, difficulty, data.length]);
useEffect(() => {
    if (data.length > 0) {
        const quizState = {
            data,
            index,
            score,
            quizSettings: { amount, category, difficulty }
        };
        localStorage.setItem('active_quiz', JSON.stringify(quizState));
    }
}, [index, score, data, amount, category, difficulty]);

useEffect(() => {
    if (result) {
        localStorage.removeItem('active_quiz');
    }
}, [result]);
    const decodeHTML = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

      const getFeedback = () => {
  const percentage = (score / data.length) * 100;
  
  if (percentage === 100) return { msg: "Ts won't take you to heaven btw", 
    color: "#00d397", 
    gif: doesheknow};
  if (percentage >= 80) return { msg: "You're not him", 
    color: "#ff4a4a", 
    gif: Regret};
  if (percentage >= 50) return { msg: '', 
    color: "#553f9a", 
    gif: Higuruma};
  if (percentage === 0) return { msg: "Did you even read?", 
    color: "#ff4a4a", 
    gif: Hesnotreading};
  return { msg: "Time to Hit the Books... 📚", 
    color: "#ff4a4a", 
    gif: speed};
};
    if (loading) return <div className='container'><h2>Loading Questions...</h2></div>;

    const currentQuestion = data[index];
    const feedback = getFeedback();

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (currentQuestion.correct_answer === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("incorrect");
                option_array.forEach(opt => {
                    if (opt.current.innerText === decodeHTML(currentQuestion.correct_answer)) {
                        opt.current.classList.add("correct");
                    }
                });
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            if (index === data.length - 1) {
                setResult(true);
                return;
            }
            setIndex(prev => prev + 1);
            setLock(false);
            option_array.forEach(opt => opt.current && opt.current.classList.remove("correct", "incorrect"));
        }
    };

    const reset = () => {
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
    };

    return (
        <div className='container'>
            {result ? (
                <div className="result-container">
                    <img src={feedback.gif} alt="My personal reaction" className="result-gif" />
                    <h2 style={{ color: feedback.color }}>{feedback.msg}</h2>
                    <h3>You scored {score} out of {data.length}</h3>
                    <div className='result-buttons'>
                    <button onClick={reset}>Retake?</button>
                    <button onClick={() => navigate('/setup')}>New Quiz?</button>
                    <button onClick={() => navigate('/')}>Home</button>
                    </div>
                </div>
            ) : (
                <>
                    <h2>{index + 1}. {decodeHTML(currentQuestion.question)}</h2>
                    <ul>
                        {currentQuestion.answers.map((ans, i) => (
                            <li key={i} ref={option_array[i]} onClick={(e) => checkAnswer(e, decodeHTML(ans))}>
                                {decodeHTML(ans)}
                            </li>
                        ))}
                    </ul>
                    <button onClick={next}>Next</button>
                    <div className="index">{index + 1} of {data.length} questions</div>
                </>
            )}
        </div>
    );
};

export default Quiz;