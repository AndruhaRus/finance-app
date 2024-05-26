import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword(formData.password)) {
      setErrorMessage('Password must be 8-16 characters long and include both letters and numbers.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      navigate('/home');
    } catch (error) {
      const errorMsg = error.response && error.response.data ? error.response.data.detail : 'Registration error';
      setErrorMessage(errorMsg);
      console.error('Registration error:', errorMsg);
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
              <h2 className="text-white mb-3">Register</h2>
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
                  Register
                </button>
              </form>
              <p className="mt-3 text-white" style={{ textAlign: 'center' }}>Do you have an account? <a href="/login" className="text-white">Login</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
