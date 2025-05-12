package com.project.foodie.administration;

import com.project.foodie.database.MealEntity;
import java.util.List;

public interface MealService {

    MealEntity addMeal(MealEntity meal);
    List<MealEntity> getMealsByUserId(Integer userId);
    ResultMessage deleteMealsByUserId(Integer userId);
}
