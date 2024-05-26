import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUserId, setLoggedIn }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const { access_token } = response.data;
      localStorage.setItem('user_id', response.data.user_id);
      console.log('ID пользователя:', response.data.user_id);
      setUserId(formData.username);
      setLoggedIn(true); // Установите loggedIn в true после успешного входа
      navigate('/home');
    } catch (error) {
    //   const errorMsg = error.response && error.response.data ? error.response.data.detail : error.message;
      let errorMsg = 'Неправильное имя пользователя или пароль. Пожалуйста, попробуйте еще раз.';
      setErrorMessage(errorMsg);
      console.error('Ошибка при входе:', errorMsg);
    }
  };

  return (
    <div style={{ backgroundColor: '#242b47', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {errorMessage && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f8d7da', color: '#721c24', padding: '10px 20px', borderRadius: '5px', zIndex: 1000 }}>
          {errorMessage}
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mx-auto my-2">
            <div className="transaction-block border rounded-3 p-4 mt-3" style={{ backgroundColor: '#181f38' }}>
              <h2 className="text-white mb-3">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label" style={{ color: 'white' }}>
                    Username
                  </label>
                  <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleInputChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label" style={{ color: 'white' }}>
                    Password
                  </label>
                  <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="mt-2 btn btn-light" style={{ backgroundColor: '#FDBF50' }}>
                  Login
                </button>
                <p className="mt-3 text-white" style={{ textAlign: 'center' }}>Don't have an account? <a href="/register" className="text-white">Register</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
