import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './foodie.css';
import UserService from '../services/UserService';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    UserService.loginUser(email, password)
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem('userId', response.data.data);
          console.log('Login successful:', response.data);
          navigate('/home');
        } else {
          setError(response.data.message || 'Login failed');
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || 'Login failed');
        } else {
          setError('Server error. Try again later.');
        }
        console.error('Login error:', error);
      });
  };

  const goToRegister = () => {
    navigate('/register');
  };

return (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <div id='LRbox'>
      <div id='LRtitl'>Log in</div>
      <form onSubmit={handleSubmit}>
        <div id='LRinputs'>
          <div>
            <label htmlFor="email" id='LRlabelEmail'>Email</label>
            <input
              type="email"
              id="LRinputEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" id='LRlabelPass'>Password</label>
            <input
              type="password"
              id="LRinputPass"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div id='LRbuttons'>
          <button type="submit" id='LsubLog'>
            Login
          </button>

          <button type="button" id='LbuttReg' onClick={goToRegister}>
            Don’t have an account? Register
          </button>
        </div>

        {error && (
          <div id='LRerr'>
            {error}
          </div>
        )}
      </form>
    </div>
  </div>
);
}

export default Login;
