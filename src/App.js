import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import api from './api';
import './scrollbar.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';

const App = () => {
    const [userId, setUserId] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false); // Добавьте состояние loggedIn

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/user/', { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    setUserId(response.data.id);
                    setLoggedIn(true); // Установите loggedIn в true при успешном входе
                })
                .catch(error => {
                    console.error('Error fetching user ID:', error);
                    localStorage.removeItem('token');
                    setLoggedIn(false); // Установите loggedIn в false при ошибке
                });
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!loggedIn ? <Login setUserId={setUserId} setLoggedIn={setLoggedIn} /> : <Navigate to="/home" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={loggedIn ? <Home userId={userId} /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
};

export default App;