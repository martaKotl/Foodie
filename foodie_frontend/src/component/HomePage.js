// HomePage.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';
import MealService from '../services/MealService';  
import DailyGoalsService from '../services/DailyGoalsService';

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

function HomePage() {
  const [meals, setMeals] = useState([]); 
  const [goals, setGoals] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [showBmiForm, setShowBmiForm] = useState(false);
  const [bmiData, setBmiData] = useState({ height: '', weight: '' });
  const [bmiResult, setBmiResult] = useState(null);
  const [showSurplusForm, setShowSurplusForm] = useState(false);
  const [surplusData, setSurplusData] = useState({ tdee: '', intake: '' });
  const [surplusResult, setSurplusResult] = useState(null);
  const [editableGoals, setEditableGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: '',
  });
  const navigate = useNavigate();

  const countSurplusForm = (value) => { 
    setShowSurplusForm(value);
   setSurplusData({ tdee: '', intake: '' });
   setSurplusResult(null);
  };

  const countBmiForm = (value) => {
    setShowBmiForm(value);
    setBmiData({ height: '', weight: '' });
    setBmiResult(null);
  };

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
      if (response?.data?.data) {
        setGoals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching daily goals:', error);
    }
  };

  const createDonutChart = (id, consumed, goal, color, label) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const remaining = Math.max(goal - consumed, 0);

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
            title: { display: true, text: label },
            legend: { display: false }
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
        .then(response => setMeals(Array.isArray(response.data) ? response.data : []))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!goals || Object.keys(goals).length === 0) return;

    const consumed = recalculateConsumedData(meals || []);
    createDonutChart('idcals', consumed.calories, goals.calories || 2000, '#ff6384', 'Calories');
    createDonutChart('carbs', consumed.carbs, goals.carbs || 250, '#4bc0c0', 'Carbs');
    createDonutChart('fats', consumed.fat, goals.fat || 70, '#ffcd56', 'Fat');
    createDonutChart('proteins', consumed.protein, goals.protein || 100, '#36a2eb', 'Protein');
  }, [meals, goals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableGoals(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
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
      alert('Failed to update goals');
    }
  };

  const handleClearMeals = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    MealService.deleteMealsByUserId(userId)
      .then(() => setMeals([]))
      .catch(console.error);
  };

  return (
    <div>
      <header id='Hheader'>
        <div>
          <h1>FOODIE</h1>
        </div>
        <div id="header-buttons">
          <button id="menu" onClick={() => setShowSidebar(true)}>☰</button>
        </div>
      </header>

      <div id="diagrams">
        <div className="cals">
          <canvas id="idcals"></canvas>
        </div>
        <div className="macrocharts">
          <div className="macro"><canvas id="carbs"></canvas></div>
          <div className="macro"><canvas id="fats"></canvas></div>
          <div className="macro"><canvas id="proteins"></canvas></div>
        </div>
      </div>

      <div id="action-buttons">
        <button id="HchangeGoals" onClick={() => {
          setEditableGoals(goals);
          setShowGoalsForm(true);
        }}>Change daily goals</button>

        <button id="HaddMeal" onClick={() => navigate('/home/add_a_meal')}>Add a Meal</button>
        <button id="HclearMeals" onClick={handleClearMeals}>Clear Meals</button>
      </div>

      {showGoalsForm && (
        <div id="overlay">
          <form id="goals-form" onSubmit={handleGoalsSubmit}>
            <h2 id='HupdateGoals'>Update Daily Goals</h2>
            {['calories', 'protein', 'carbs', 'fat', 'water'].map(nutrient => (
              <label key={nutrient} className='HnutrientLabel'>
                {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}:
                <input
                  type="number"
                  name={nutrient}
                  className='HnutrientInput'
                  value={editableGoals[nutrient]}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </label>
            ))}
            <div className="form-buttons">
              <button type="submit" id="HsubGoals">Submit</button>
              <button type="button" id="HcancelGoals" onClick={() => setShowGoalsForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

{showBmiForm && (
  <div id="overlay">
    <form id="Sbmi-form" onSubmit={(e) => {
      e.preventDefault();
      const heightM = parseFloat(bmiData.height) / 100;
      const weight = parseFloat(bmiData.weight);
      if (heightM > 0 && weight > 0) {
        const bmi = (weight / (heightM * heightM)).toFixed(2);
        setBmiResult(bmi);
      }
    }}>
      <h2 id='ScountBMI'>Calculate BMI</h2>
      <label className='SbmiLabel'>
        Height (cm):
        <input
          type="number"
          name="height"
          className='SbmiInput'
          required
          min="0"
          value={bmiData.height}
          onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
        />
      </label>
      <label className='SbmiLabel'>
        Weight (kg):
        <input
          type="number"
          name="weight"
          className='SbmiInput'
          required
          min="0"
          value={bmiData.weight}
          onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
        />
      </label>
      {bmiResult && (
        <p id='SbmiResult'>Your BMI is: <strong>{bmiResult}</strong></p>
      )}
      <div className="form-buttons">
        <button type="submit" id="SsubBMI">Calculate</button>
        <button type="button" id="ScloseBMI" onClick={() => setShowBmiForm(false)}>Close</button>
      </div>
    </form>
  </div>
)}

{showSurplusForm && (
  <div id="overlay">
    <form id="Ssurplus-form" onSubmit={(e) => {
      e.preventDefault();
      const tdee = parseFloat(surplusData.tdee);
      const intake = parseFloat(surplusData.intake);
      if (!isNaN(tdee) && !isNaN(intake)) {
        const result = intake - tdee;
        setSurplusResult(result);
      }
    }}>
      <h2 id='ScountSurplus'>jak cos to ma dzialac inaczej ale chat gpt 4o mi sie skonczyl i dokoncze pozniej paa</h2>
      <label className='SsurplusLabel'>
        TDEE (your maintenance calories):
        <input
          type="number"
          name="tdee"
          className='SsurplusInput'
          required
          min="0"
          value={surplusData.tdee}
          onChange={(e) => setSurplusData({ ...surplusData, tdee: e.target.value })}
        />
      </label>
      <label className='SsurplusLabel'>
        Actual Intake Today:
        <input
          type="number"
          name="intake"
          className='SsurplusInput'
          required
          min="0"
          value={surplusData.intake}
          onChange={(e) => setSurplusData({ ...surplusData, intake: e.target.value })}
        />
      </label>

      {surplusResult !== null && (
        <p>
          You have a <strong>{Math.abs(surplusResult)}</strong> calorie{' '}
          <strong>{surplusResult > 0 ? 'surplus' : 'deficit'}</strong> today.
        </p>
      )}

      <div className="form-buttons">
        <button type="submit" id='SsubSurplus'>Calculate</button>
        <button type="button" id='ScancelSurplus' onClick={() => setShowSurplusForm(false)}>Close</button>
      </div>
    </form>
  </div>
)}


      <div id="meal_table">
        {meals.length > 0 ? (
          <table border="1" id="meals">
            <thead>
              <tr>
                <th>Meal</th><th>Grams</th><th>Calories</th><th>Fat</th>
                <th>Carbs</th><th>Fiber</th><th>Protein</th><th>Salt</th><th>Time added</th><th></th>
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
                    <button className="edit-button" onClick={() => navigate('/home/add_a_meal', { state: { meal } })}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="empty-msg">Add a meal to see it here!</p>}
      </div>

      {showSidebar && (
        <div id="Hsidebar">
          <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✖</button>
          <button className='sidebarOption' id="profile">My Profile</button>
          <button className='sidebarOption' id="recipes">Browse Recipes</button>
          <button className='sidebarOption' id="bmi_calc" onClick={() => countBmiForm(true)}>BMI calculator</button>
          <button className='sidebarOption' id="goal_weight" onClick={() => countSurplusForm(true)}>Calculate daily calorie surplus/deficit</button>
          <button className='sidebarOption' id="daily_goals" onClick={() => setShowGoalsForm(true)}>Change daily goals</button>
          <button className='sidebarOption' id="Hlogout" onClick={() => {
            localStorage.removeItem('userId');
            navigate('/');
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
