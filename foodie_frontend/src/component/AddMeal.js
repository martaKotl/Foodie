import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './foodie.css';
import MealService from '../services/MealService';

const macroLabels = ['Calories', 'Fat', 'Carbohydrate', 'Fiber', 'Protein', 'Salt'];

function AddMeal() {
  const [mealname, setMealname] = useState('');
  const [grams, setGrams] = useState('');
  const [macros, setMacros] = useState({
    Calories: '',
    Fat: '',
    Carbohydrate: '',
    Fiber: '',
    Protein: '',
    Salt: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleMacroChange = (label, value) => {
    setMacros(prev => ({ ...prev, [label]: value }));
  };

  const submitForm = () => {
    if (!grams || Object.values(macros).includes('')) {
      setErrorMessage('Please fill in all the required fields for grams and macros.');
      setSuccessMessage('');
      return;
    }

    setErrorMessage('');
    const gr = parseFloat(grams) || 0;
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setErrorMessage("User not logged in.");
      return;
    }

    const meal = {
      name: mealname || 'unnamed',
      weightGrams: gr,
      calories: ((gr * (parseFloat(macros.Calories) || 0)) / 100).toFixed(2),
      fat: ((gr * (parseFloat(macros.Fat) || 0)) / 100).toFixed(2),
      carbs: ((gr * (parseFloat(macros.Carbohydrate) || 0)) / 100).toFixed(2),
      fiber: ((gr * (parseFloat(macros.Fiber) || 0)) / 100).toFixed(2),
      protein: ((gr * (parseFloat(macros.Protein) || 0)) / 100).toFixed(2),
      salt: ((gr * (parseFloat(macros.Salt) || 0)) / 100).toFixed(2),
      user: {
        id: parseInt(userId)
      }
    };

    MealService.addMeal(meal)
      .then(response => {
        console.log('Meal added successfully:', response);
        setSuccessMessage('Meal added successfully!');
        setErrorMessage('');

        setTimeout(() => {
          navigate('/home');
        }, 2000);
      })
      .catch(error => {
        console.error('Error adding meal:', error);
        setErrorMessage('Error adding meal. Please try again.');
        setSuccessMessage('');
      });
  };

  const cancelForm = () => {
    navigate('/home');
  };

  return (
    <div>
      <header>
        <h1>Add a meal</h1>
        <div id="fot" style={{ margin: '20px' }}>
          <img src="/foodie_logo.png" alt="Meal icon" />
        </div>
      </header>

      <div style={{ margin: '10px' }}>
        <label>Name of the meal: </label>
        <input
          type="text"
          className="input-box"
          value={mealname}
          onChange={e => setMealname(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <div style={{ margin: '10px' }}>
        <label>How many grams did you consume? </label>
        <input
          type="number"
          className="input-box"
          value={grams}
          onChange={e => setGrams(e.target.value)}
        />
        <span> g</span>
      </div>

      <p id="enter" style={{ margin: '40px' }}><strong>Enter macros per 100g:</strong></p>
      <div id="macros">
        {macroLabels.map(label => (
          <div key={label} style={{ margin: '10px' }}>
            {label}:{' '}
            <input
              type="number"
              className="input-box"
              value={macros[label]}
              onChange={e => handleMacroChange(label, e.target.value)}
            />
            <span style={{ display: 'inline-block', margin: 0 }}>g</span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', margin: '20px' }}>
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p style={{ color: 'green', fontSize: '14px', fontWeight: 'bold', margin: '20px' }}>
          {successMessage}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
          id="cancel"
          onClick={cancelForm}
          style={{
            backgroundColor: '#ff4545',
            border: '1px solid #333',
            borderRadius: '15px',
            padding: '15px 40px',
            fontSize: '18px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            width: 'auto',
            color: '#ebebeb'
          }}
        >
          Cancel
        </button>

        <button
          id="submit"
          onClick={submitForm}
          style={{
            backgroundColor: '#ebebeb',
            border: '1px solid #333',
            borderRadius: '15px',
            padding: '15px 40px',
            fontSize: '18px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            width: 'auto'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddMeal;
