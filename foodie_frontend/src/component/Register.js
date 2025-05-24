import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './foodie.css';
import UserService from '../services/UserService';

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setError("");
      const payload = {
        id: null,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        isActive: false,
        registrationDate: new Date().toISOString(),
        activationDate: null,
      };
      
    try {
      const response = await UserService.registerUser(payload);
      const result = response.data;

      if (result.success) {
        setMessage(result.message);
        setError('');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(result.message);
        setMessage('');
      }
     
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Unexpected error ocurred.");
      } else {
        setError("No connection with a server.");
      }
      setMessage('');
    }
  };

  return (
    <div>
      <div id='LRbox'>
      <div id='LRtitl'>Register</div>
      <form onSubmit={handleSubmit}>
        <div id='LRinputs'>
          <div>
            <label htmlFor="username" id='RlabelUser'>Username</label>
            <input
              type="text"
              id="RinputUser"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" id='RlabelConf'>Confirm Password</label>
            <input
              type="password"
              id="RinputConf"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && (
          <div id='LRerr'>{error}</div>)}
        {message && (
          <div id='Rmess'>{message}</div>)}

        <div id='LRbuttons'>
            <button
              type="submit"
              id='RsubReg'
            >
              Register
            </button>

            <button
              type="button"
              id='RbuttLog'
              onClick={() => navigate("/")}
            >
              Already have an account? Login instead
            </button>
          </div>
        
      </form>
    </div>
    </div>
  );
}

export default Register