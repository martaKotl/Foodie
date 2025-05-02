import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        setTimeout(() => navigate('/login'), 3000);
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
    <div className="register-container">
      <div className="mx-36 my-8 text-4xl text-slate-700 font-medium">Register</div>
      <form onSubmit={handleSubmit}>
        <div className="mx-8 my-8 text-2xl text-gray-700 font-medium">
          <div className="">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-90 px-4 py-1 mx-8 text-black text-lg font-normal border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="my-6">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-90 px-4 py-1 mx-8 text-black text-lg font-normal border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="my-6">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-90 px-4 py-1 mx-8 text-black text-lg font-normal border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="my-6">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-90 px-4 py-1 mx-8 text-black text-lg font-normal border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-lg font-semibold text-center mt-4 my-2">{error}</div>)}
        {message && (
          <div className="text-green-600 text-lg font-semibold text-center mt-4 my-2">{message}</div>)}

        <button type="button"
          onClick={() => navigate("/login")}
          className="register-btn text-2xl rounded bg-red-600 text-white hover:bg-red-700 font-semibold px-5 py-2 mx-32 my-2">
          Cancel
        </button>
        <button type="submit" 
          className="register-btn text-2xl rounded bg-green-600 text-white hover:bg-green-700 font-semibold px-3 py-2 my-2">
          Register
        </button>
        
      </form>
    </div>
  );
}

export default Register