import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './foodie.css';
import MealService from '../services/MealService';
import RecipeService from '../services/RecipeService';
import { useLocation } from 'react-router-dom';

const macroLabels = ['Calories', 'Fat', 'Carbohydrate', 'Fiber', 'Protein', 'Salt'];

function AddMeal() {
  const location = useLocation();
  const editingMeal = location.state?.meal || null;

  const [isEditing, setIsEditing] = useState(false);
  const [mealId, setMealId] = useState('');
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

  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const per100gRef = useRef({});

  const totalMacros = () => {
    const weight = parseFloat(grams) || 0;
    const totals = {};
    for (const key of macroLabels) {
      totals[key] = ((weight * (parseFloat(macros[key]) || 0)) / 100).toFixed(2);
    }
    return totals;
  };

  useEffect(() => {
    RecipeService.getAllRecipes()
      .then(recipeList => {
        setRecipes(recipeList);
        const defaultRecipe = recipeList.find(r => r.id === 1);
        if (defaultRecipe && !editingMeal) {
          setMealname(defaultRecipe.name);
          setMacros({
            Calories: defaultRecipe.caloriesPer100g?.toString() || '',
            Fat: defaultRecipe.fatPer100g?.toString() || '',
            Carbohydrate: defaultRecipe.carbsPer100g?.toString() || '',
            Fiber: defaultRecipe.fiber?.toString() || '',
            Protein: defaultRecipe.proteinPer100g?.toString() || '',
            Salt: defaultRecipe.salt?.toString() || '',
          });
          setGrams(defaultRecipe.weightOfMeal?.toString() || '');
        } else if (recipeList.length > 0 && !editingMeal) {
          const first = recipeList[0];
          setMealname(first.name);
          setMacros({
            Calories: first.caloriesPer100g?.toString() || '',
            Fat: first.fatPer100g?.toString() || '',
            Carbohydrate: first.carbsPer100g?.toString() || '',
            Fiber: first.fiber?.toString() || '',
            Protein: first.proteinPer100g?.toString() || '',
            Salt: first.salt?.toString() || '',
          });
          setGrams(first.weightOfMeal?.toString() || '');
        }
      })
      .catch(error => {
        console.error('Failed to load recipes:', error);
      });
  }, []);

  useEffect(() => {
    if (editingMeal) {
      setIsEditing(true);
      setMealname(editingMeal.name);
      setGrams(editingMeal.weightGrams?.toString() || '');
      setMealId(editingMeal.id);

      const weight = parseFloat(editingMeal.weightGrams || 0);

      const toPer100g = (val) => weight ? ((parseFloat(val) || 0) * 100 / weight).toFixed(2) : '0';

      const per100g = {
        Calories: toPer100g(editingMeal.calories),
        Fat: toPer100g(editingMeal.fat),
        Carbohydrate: toPer100g(editingMeal.carbs),
        Fiber: toPer100g(editingMeal.fiber),
        Protein: toPer100g(editingMeal.protein),
        Salt: toPer100g(editingMeal.salt),
      };
      per100gRef.current = per100g;
      setMacros(per100g);
    }
  }, [editingMeal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

    const totals = totalMacros();

    const meal = {
      id: mealId || null,
      name: mealname || 'Unnamed meal',
      weightGrams: gr,
      calories: totals.Calories,
      fat: totals.Fat,
      carbs: totals.Carbohydrate,
      fiber: totals.Fiber,
      protein: totals.Protein,
      salt: totals.Salt,
      userId: parseInt(userId)
    };

    if (editingMeal) {
      MealService.editMeal(editingMeal.id, meal)
        .then(response => {
          setSuccessMessage('Meal updated successfully!');
          setErrorMessage('');
          setTimeout(() => navigate('/home'), 1500);
        })
        .catch(error => {
          setErrorMessage('Error updating meal. Please try again.');
          setSuccessMessage('');
        });
      return;
    }

    if (!editingMeal) {
      MealService.addMeal(meal)
        .then(response => {
          setSuccessMessage('Meal added successfully!');
          setErrorMessage('');
          setTimeout(() => { navigate('/home'); }, 1500);
        })
        .catch(error => {
          setErrorMessage('Error adding meal. Please try again.');
          setSuccessMessage('');
        });
    }
  };

  const cancelForm = () => {
    navigate('/home');
  };

  return (
    <div>
      <header id="Aheader">
        <h1>Add a meal</h1>
      </header>

      <div id="Abox">
        <label htmlFor="mealname-input" id="AmealLabel">Name of the meal:</label>
        <div id="dropdown-wrapper" ref={dropdownRef}>
          <input
            type="text"
            id="mealname-input"
            className="input-box"
            value={mealname}
            onChange={e => setMealname(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && (
            <div id="dropdown-list">
              {recipes.map((recipe, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => {
                    setMealname(recipe.name);
                    setMacros({
                      Calories: recipe.caloriesPer100g?.toString() || '',
                      Fat: recipe.fatPer100g?.toString() || '',
                      Carbohydrate: recipe.carbsPer100g?.toString() || '',
                      Fiber: recipe.fiber?.toString() || '',
                      Protein: recipe.proteinPer100g?.toString() || '',
                      Salt: recipe.salt?.toString() || '',
                    });
                    setGrams(recipe.weightOfMeal?.toString() || '');
                    setShowDropdown(false);
                  }}
                >
                  {recipe.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="grams-container">
        <label htmlFor="grams-input" id='AgramsInput'>How many grams did you consume?</label>
        <input
          type="number"
          id="grams-input"
          min="0"
          className="input-box"
          value={grams}
          onChange={e => setGrams(e.target.value)}
        />
        <span id='Agrams'> g</span>
      </div>

      <label id="AmacrosLabel">Enter macros per 100g:</label>
      <div id="macros-container">
        {macroLabels.map(label => (
          <div key={label} className="macro-input-row">
            <label htmlFor={`macro-${label.toLowerCase()}`} className="macro-label">{label}:</label>
            <input
              type="number"
              min="0"
              id={`macro-${label.toLowerCase()}`}
              className="input-box macro-input"
              value={
                isEditing && grams
                  ? ((parseFloat(per100gRef.current[label]) || 0) * parseFloat(grams) / 100).toFixed(2)
                  : macros[label]
              }
              onChange={e => handleMacroChange(label, e.target.value)}
            />
            <span>g</span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p id="error-message">{errorMessage}</p>
      )}

      {successMessage && (
        <p id="success-message">{successMessage}</p>
      )}

      <button id="AcancelAdd" onClick={cancelForm}>Cancel</button>
      <button id="AsubAdd" onClick={submitForm}>Submit</button>
    </div>
  );
}

export default AddMeal;
