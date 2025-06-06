package com.project.foodie.administration;

import com.project.foodie.database.RecipeEntity;

import java.util.List;
import java.util.Optional;

public interface RecipeService {
    List<RecipeEntity> getAllRecipes();
    Optional<RecipeEntity> getRecipeById(Long id);
}
