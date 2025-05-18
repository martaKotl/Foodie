package com.project.foodie.administration;

import com.project.foodie.database.Meal;
import com.project.foodie.database.MealEntity;
import java.util.List;

public interface MealService {

    ResultMessage addMeal(Meal meal);
    List<MealEntity> getMealsByUserId(Integer userId);
    ResultMessage deleteMealsByUserId(Integer userId);
    ResultMessage editMeal(Integer id, Meal updatedMeal);
}
