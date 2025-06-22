import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeService from "../services/RecipeService";

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [showStepsId, setShowStepsId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RecipeService.getAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Failed to fetch recipes:", error));
  }, []);

  const toggleDetails = (id) => {
    setOpenRecipeId((prev) => (prev === id ? null : id));
    setShowStepsId(null);
  };

  const toggleSteps = (id) => {
  setShowStepsId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="BRcont">
      <div className="BRcont2">
        <h1 className="heading">Browse Recipes</h1>
        <p className="par">
        </p>

        <ol className="BRlist">
          {recipes.slice(1).map((recipe, index) => (
            <li key={recipe.id}>
              <button
                className="BRbutton"
                onClick={() => toggleDetails(recipe.id)}
              >
                {index + 1}. {recipe.name}
              </button>
              {openRecipeId === recipe.id && (
                <div className="BRdetails">
                  <p>{recipe.caloriesPer100g} kcal</p>
                  <p>{recipe.proteinPer100g}g protein</p>
                  <p>{recipe.carbsPer100g}g carbs</p>
                  <p>{recipe.fatPer100g}g fat</p>
                  <p><strong>Diet:</strong> {recipe.dietCategory}</p>
                  <p><strong>Prep time:</strong> {recipe.prepTimeMinutes} minutes</p>
                  <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p
                    className="mt-2 underline text-red-600 cursor-pointer"
                    onClick={() => toggleSteps(recipe.id)}
                  >
                  {showStepsId === recipe.id ? "Hide Steps" : "Show Steps"}
                  </p>
                  {showStepsId === recipe.id && (
                    <pre className="Recipe-steps">
                      {recipe.steps}
                    </pre>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
        <span className="BRback" onClick={() => navigate("/home")}>
            Go back to home page
          </span>
      </div>
    </div>
  );
};

export default BrowseRecipes;
