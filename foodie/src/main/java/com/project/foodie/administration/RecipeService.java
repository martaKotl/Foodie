package com.project.foodie.administration;

import com.project.foodie.database.RecipeEntity;

import java.util.List;

public interface RecipeService {
    List<RecipeEntity> getAllRecipes();
}
