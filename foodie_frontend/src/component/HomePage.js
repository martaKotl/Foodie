import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';
import './foodie.css';
import MealService from '../services/MealService';  

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

function HomePage() {
  const [meals, setMeals] = useState([]); 
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

  const createDonutChart = (id, consumed, goal, color, label) => {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    if (chartRefs.current[id]) {
      chartRefs.current[id].data.datasets[0].data = [consumed, Math.max(goal - consumed, 0)];
      chartRefs.current[id].update();
    } else {
      chartRefs.current[id] = new ChartJS(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Consumed', 'Remaining'],
          datasets: [{
            data: [consumed, Math.max(goal - consumed, 0)],
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
          cutout: '70%'  
        }
      });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
    if (userId) {
      MealService.getMealsByUserId(userId)
        .then(response => {
          console.log('API Response:', response);

          if (response && Array.isArray(response.data)) {
            setMeals(response.data); 

            const consumed = recalculateConsumedData(response.data);
            const goals = { calories: 2000, protein: 100, fat: 70, carbs: 250 };

            createDonutChart('idcals', consumed.calories, goals.calories, '#ff6384', 'Calories');
            createDonutChart('carbs', consumed.carbs, goals.carbs, '#4bc0c0', 'Carbs');
            createDonutChart('fats', consumed.fat, goals.fat, '#ffcd56', 'Fat');
            createDonutChart('proteins', consumed.protein, goals.protein, '#36a2eb', 'Protein');
          } else {
            console.error('Fetched data is not an array:', response.data);
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
    if (meals.length > 0) {
      const consumed = recalculateConsumedData(meals);
      const goals = { calories: 2000, protein: 100, fat: 70, carbs: 250 };

      createDonutChart('idcals', consumed.calories, goals.calories, '#ff6384', 'Calories');
      createDonutChart('carbs', consumed.carbs, goals.carbs, '#4bc0c0', 'Carbs');
      createDonutChart('fats', consumed.fat, goals.fat, '#ffcd56', 'Fat');
      createDonutChart('proteins', consumed.protein, goals.protein, '#36a2eb', 'Protein');
    } else {
      const goals = { calories: 2000, protein: 100, fat: 70, carbs: 250 };
      createDonutChart('idcals', 0, goals.calories, '#ff6384', 'Calories');
      createDonutChart('carbs', 0, goals.carbs, '#4bc0c0', 'Carbs');
      createDonutChart('fats', 0, goals.fat, '#ffcd56', 'Fat');
      createDonutChart('proteins', 0, goals.protein, '#36a2eb', 'Protein');
    }
  }, [meals]); 

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
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.name}</td>
                <td>{meal.weightGrams}</td>
                <td>{meal.calories}</td>
                <td>{meal.fat}</td>
                <td>{meal.carbs}</td>
                <td>{meal.fiber}</td>
                <td>{meal.protein}</td>
                <td>{meal.salt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: '20px', marginBottom: '20px' }}>Add a meal to see it here!</p>
      )}
    </div>
  );
}

export default HomePage;
