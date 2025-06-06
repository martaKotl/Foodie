import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeService from '../services/RecipeService';

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    RecipeService.getRecipeById(id).then(res => {
      setRecipe(res.data);
    });
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-4 text-center">
      <button onClick={() => navigate(-1)} className="underline mb-2">← Back</button>
      <h2 className="text-2xl font-bold">{recipe.name}</h2>
      <p><strong>Calories/100g:</strong> {recipe.caloriesPer100g}</p>
      <p><strong>Protein/100g:</strong> {recipe.proteinPer100g}</p>
      <p><strong>Carbs/100g:</strong> {recipe.carbsPer100g}</p>
      <p><strong>Fat/100g:</strong> {recipe.fatPer100g}</p>
      <p><strong>Fiber:</strong> {recipe.fiber}</p>
      <p><strong>Salt:</strong> {recipe.salt}</p>
      <p><strong>Category:</strong> {recipe.dietCategory}</p>
      <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} mins</p>
      <h3 className="font-bold mt-4">Ingredients:</h3>
      <p>{recipe.ingredients}</p>
      <h3 className="font-bold mt-2">Steps:</h3>
      <p>{recipe.steps}</p>
    </div>
  );
}

export default RecipeDetails;
