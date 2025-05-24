import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';
import MealService from '../services/MealService';  
import DailyGoalsService from '../services/DailyGoalsService';

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

function HomePage() {
  const [meals, setMeals] = useState([]); 
  const [goals, setGoals] = useState({});
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [editableGoals, setEditableGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: '',
  });
  const navigate = useNavigate();

  const chartRefs = useRef({
    calories: null,
    carbs: null,
    fats: null,
    proteins: null,
  }); 

  const recalculateConsumedData = (meals) => {
    return {
      calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      protein: meals.reduce((sum, meal) => sum + meal.protein, 0),
      fat: meals.reduce((sum, meal) => sum + meal.fat, 0),
      carbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
    };
  };

  const fetchUserGoals = async (userId) => {
    try {
      const response = await DailyGoalsService.getGoals(userId);
      if (response && response.data && response.data.data) {
        console.log('Fetched user goals:', response.data.data);
        setGoals(response.data.data);
      } else {
        console.warn('No daily goal data found for user.');
      }
    } catch (error) {
      console.error('Error fetching daily goals:', error);
    }
  };

  const createDonutChart = (id, consumed, goal, color, label) => {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    const remaining = Math.max(goal - consumed, 0);
    console.log(`Creating chart for ${label}: consumed=${consumed}, goal=${goal}, remaining=${remaining}`);

    if (chartRefs.current[id]) {
      chartRefs.current[id].data.datasets[0].data = [consumed, remaining];
      chartRefs.current[id].update();
    } else {
      chartRefs.current[id] = new ChartJS(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Consumed', 'Remaining'],
          datasets: [{
            data: [consumed, remaining],
            backgroundColor: [color, '#e0e0e0'],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: label
            },
            legend: {
              display: false
            }
          },
          cutout: '70%',
        }
      });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserGoals(userId);
      MealService.getMealsByUserId(userId)
        .then(response => {
          if (response && Array.isArray(response.data)) {
            setMeals(response.data);
          } else {
            console.error('Fetched meals data is not an array:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching meals:', error);
        });
    } else {
      console.error('User not logged in.');
    }
  }, []);

  useEffect(() => {
    if (!goals || Object.keys(goals).length === 0) return;

    const caloriesGoal = Number(goals.calories) || 2000;
    const proteinGoal = Number(goals.protein) || 100;
    const fatGoal = Number(goals.fat) || 70;
    const carbsGoal = Number(goals.carbs) || 250;

    const consumed = recalculateConsumedData(meals || []);

    createDonutChart('idcals', consumed.calories, caloriesGoal, '#ff6384', 'Calories');
    createDonutChart('carbs', consumed.carbs, carbsGoal, '#4bc0c0', 'Carbs');
    createDonutChart('fats', consumed.fat, fatGoal, '#ffcd56', 'Fat');
    createDonutChart('proteins', consumed.protein, proteinGoal, '#36a2eb', 'Protein');
  }, [meals, goals]);

  // Open modal and prefill inputs with current goals
  const openGoalsForm = () => {
    setEditableGoals({
      calories: goals.calories || '',
      protein: goals.protein || '',
      carbs: goals.carbs || '',
      fat: goals.fat || '',
      water: goals.water || '',
    });
    setShowGoalsForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableGoals(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalsSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('User not logged in');
        return;
      }

      const updatedGoals = {
        calories: Number(editableGoals.calories),
        protein: Number(editableGoals.protein),
        carbs: Number(editableGoals.carbs),
        fat: Number(editableGoals.fat),
        water: Number(editableGoals.water),
      };

      await DailyGoalsService.updateGoals(userId, updatedGoals);
      setGoals(updatedGoals);
      setShowGoalsForm(false);
    } catch (error) {
      console.error('Error updating daily goals:', error);
      alert('Failed to update goals. Please try again.');
    }
  };

  const handleGoalsCancel = () => {
    setShowGoalsForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleClearMeals = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      MealService.deleteMealsByUserId(userId)
        .then(response => {
          console.log('Meals cleared successfully:', response);
          setMeals([]);
        })
        .catch(error => {
          console.error('Error clearing meals:', error);
        });
    } else {
      console.error('User not logged in.');
    }
  };

  return (
    <div>
      <header>
        <h1>FOODIE</h1>
        <img src="/foodie_logo.png" alt="Foodie Logo" id="logo" />
        <div id="header"></div>
        <button id="logout" onClick={handleLogout}>Logout</button>
      </header>

      <div id="diagrams">
        <div className="cals">
          <canvas id="idcals"></canvas>
        </div>
        <div className="macrocharts">
          <div className="macro">
            <canvas id="carbs"></canvas>
          </div>
          <div className="macro">
            <canvas id="fats"></canvas> 
          </div>
          <div className="macro">
            <canvas id="proteins"></canvas> 
          </div>
        </div>
      </div>

      <button
        onClick={openGoalsForm}
        style={{
          backgroundColor: '#ebebeb',
          border: '1px solid #333',
          borderRadius: '15px',
          padding: '15px 40px',
          fontSize: '18px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          width: 'auto',
          marginRight: '20px'
        }}
      >
        Change daily goals
      </button>

      <button 
        onClick={() => navigate('/home/add_a_meal')} 
        className="add-meal-button"
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
        Add a Meal
      </button>

      <button
        onClick={handleClearMeals}
        className="clear-meals-button"
        style={{
          backgroundColor: '#f44336', 
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '15px 40px',
          fontSize: '18px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          width: 'auto',
          marginLeft: '20px'
        }}
      >
        Clear Meals
      </button>

      {/* Modal for changing daily goals */}
      {showGoalsForm && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleGoalsSubmit}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              minWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <h2>Update Daily Goals</h2>
            <label>
              Calories:
              <input
                type="number"
                name="calories"
                value={editableGoals.calories}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>
            <label>
              Protein (g):
              <input
                type="number"
                name="protein"
                value={editableGoals.protein}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>
            <label>
              Carbs (g):
              <input
                type="number"
                name="carbs"
                value={editableGoals.carbs}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>
            <label>
              Fat (g):
              <input
                type="number"
                name="fat"
                value={editableGoals.fat}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>
            <label>
              Water (ml):
              <input
                type="number"
                name="water"
                value={editableGoals.water}
                onChange={handleInputChange}
                required
                min="0"
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleGoalsCancel}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div id="meal_table">
        {meals.length > 0 ? (
  <table border="1" id="meals">
    <thead>
      <tr>
        <th>Meal</th>
        <th>Grams</th>
        <th>Calories</th>
        <th>Fat</th>
        <th>Carbs</th>
        <th>Fiber</th>
        <th>Protein</th>
        <th>Salt</th>
        <th>Time added</th>
      </tr>
    </thead>
    <tbody>
      {meals.map((meal, index) => (
        <tr key={meal._id || index}>
          <td>{meal.name}</td>
          <td>{meal.weightGrams}</td>
          <td>{meal.calories}</td>
          <td>{meal.fat}</td>
          <td>{meal.carbs}</td>
          <td>{meal.fiber}</td>
          <td>{meal.protein}</td>
          <td>{meal.salt}</td>
          <td>{new Date(Number(meal.createdAt)).toLocaleString()}</td>
          <td>
            <button
              onClick={() => navigate('/home/add_a_meal', { state: { meal } })}
              style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}
            >
              Edit
            </button>
        </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p style={{ marginTop: '20px', marginBottom: '20px' }}>Add a meal to see it here!</p>
)}

      </div>
    </div>
  );
}

export default HomePage;
