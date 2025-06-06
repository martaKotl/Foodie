import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeService from "../services/RecipeService";

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RecipeService.getAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Failed to fetch recipes:", error));
  }, []);

  const toggleDetails = (id) => {
    setOpenRecipeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-yellow-100 min-h-screen font-['Press_Start_2P'] text-sm text-red-900">
      <div className="text-center pt-8 px-4 sm:px-8">
        <h1 className="text-3xl mb-4">Browse Recipes</h1>
        <p className="mb-6">
          <span className="cursor-pointer underline" onClick={() => navigate("/home")}>
            ← Go to home page
          </span>
        </p>

        <ol className="text-left space-y-4 max-w-4xl mx-auto">
          {recipes.map((recipe, index) => (
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
