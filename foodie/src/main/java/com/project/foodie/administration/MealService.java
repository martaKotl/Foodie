package com.project.foodie.administration;

import com.project.foodie.database.MealEntity;
import java.util.List;

public interface MealService {

    // Method to add a new meal
    MealEntity addMeal(MealEntity meal);

    // Method to get all meals of a user
    List<MealEntity> getMealsByUserId(Integer userId);

    // Method to delete all meals of a user
    ResultMessage deleteMealsByUserId(Integer userId);
}
