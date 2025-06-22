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
    <div className="min-h-screen font-['Press_Start_2P'] text-sm text-red-900 flex justify-center items-start pt-8">
      <div className="bg-yellow-100 text-center px-4 py-6 sm:px-8 rounded-xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl mb-4">Browse Recipes</h1>
        <p className="mb-6">
          <span className="cursor-pointer underline" onClick={() => navigate("/home")}>
            ← Go to home page
          </span>
        </p>

        <ol className="text-left space-y-4 max-w-4xl mx-auto">
          {recipes.slice(1).map((recipe, index) => (
            <li key={recipe.id}>
              <button
                className="underline text-left hover:text-red-700"
                onClick={() => toggleDetails(recipe.id)}
              >
                {index + 1}. {recipe.name}
              </button>
              {openRecipeId === recipe.id && (
                <div className="pl-4 pt-1 text-red-800 text-xs">
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
      </div>
    </div>
  );
};

export default BrowseRecipes;
