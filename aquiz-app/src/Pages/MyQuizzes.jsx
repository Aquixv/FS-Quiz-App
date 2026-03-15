import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';

const MyQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user?.id) return navigate('/');
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        const res = await fetch(`${API_BASE_URL}/api/my-quizzes/${user.id}`);
        const data = await res.json();
        setQuizzes(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            await fetch(`${API_BASE_URL}/api/quizzes/${id}`, { method: 'DELETE' });
            setQuizzes(quizzes.filter(q => q._id !== id));
        }
    };

    return (
        <div className="bg-deep-purple min-h-screen p-6 text-lavender-light">
            <header className="flex items-center mb-8">
                <button onClick={() => navigate(-1)} className="material-symbols-outlined mr-4">arrow_back</button>
                <h1 className="text-2xl font-bold text-white">My Custom Quizzes</h1>
            </header>

            <div className="space-y-4">
                {quizzes.length > 0 ? quizzes.map(quiz => (
                    <div key={quiz._id} className="glass-card p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white text-lg">{quiz.quizTitle}</h3>
                            <p className="text-xs text-lavender-light/40">Code: <span className="text-neon-yellow">{quiz.quizCode}</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleDelete(quiz._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                            <button 
                                onClick={() => navigate('/quiz', { state: { quizId: quiz._id } })} 
                                className="bg-electric-violet/20 p-2 rounded-lg text-electric-violet"
                            >
                                <span className="material-symbols-outlined">play_arrow</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 opacity-30 italic">You haven't created any quizzes yet.</div>
                )}
            </div>
            
            <button 
                onClick={() => navigate('/create')}
                className="fixed bottom-10 right-6 size-16 bg-neon-yellow text-deep-purple rounded-full shadow-2xl flex items-center justify-center font-bold text-3xl"
            >
                +
            </button>
        </div>
    );
};

export default MyQuizzes;