import React, { useEffect, useState } from "react";
import HistoryService from "../services/HistoryService";
import { useNavigate } from "react-router-dom";

function History() {
  const [historyMeals, setHistoryMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedUserId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedUserId) return;
    HistoryService.getHistoryMealsByUserId(storedUserId)
      .then((data) => {
        setHistoryMeals(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch history meals.");
        setLoading(false);
        console.error(err);
      });
  }, [storedUserId]);

  if (loading) return <p>Loading history meals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="meal_table">
      <h1 className="retroFont" style={{ fontSize: "36px", marginBottom: "30px" }}>
        Meal History
      </h1>
      <button
        className="retroFont"
        style={{
          backgroundColor: "#8b0000",
          color: "#fdedcb",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          boxShadow: "2px 2px 0 #5e0000",
          fontSize: "16px",
          marginBottom: "20px",
          transition: "transform 0.1s ease"
        }}
        onClick={() => navigate("/home")}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
      >
        Go back to home page
      </button>

      {historyMeals.length > 0 ? (
        <table border="1" id="historyMeals">
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
            {historyMeals.map((meal, index) => (
              <tr key={meal.id || index}>
                <td>{meal.name}</td>
                <td>{meal.weightGrams}</td>
                <td>{meal.calories}</td>
                <td>{meal.fat}</td>
                <td>{meal.carbs}</td>
                <td>{meal.fiber}</td>
                <td>{meal.protein}</td>
                <td>{meal.salt}</td>
                <td>{new Date(Number(meal.createdAt)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="Sheader">Clear your daily meals to have them appear here</p>
      )}
    </div>
  );
};

export default History;
