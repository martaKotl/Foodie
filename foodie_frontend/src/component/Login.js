import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        console.log('Login successful:', response.data);
        navigate('/home');              // DO ZMIANY
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-4xl text-slate-700 font-medium text-center mb-8">Log in</div>
        <form onSubmit={handleSubmit}>
          <div className="text-gray-700 font-medium text-lg space-y-6">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 mt-6">
            <button
              type="submit"
              className="text-xl w-full rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold px-3 py-2"
            >
              Login
            </button>

            <button
              type="button"
              onClick={goToRegister}
              className="text-base text-blue-600 underline hover:text-blue-800"
            >
              Don’t have an account? Register instead
            </button>
          </div>

          
          {error && (
            <div className="mt-4 text-center text-red-600 font-medium">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;

