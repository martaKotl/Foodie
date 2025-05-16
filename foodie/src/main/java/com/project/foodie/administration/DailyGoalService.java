package com.project.foodie.administration;

import com.project.foodie.database.DailyGoal;

public interface DailyGoalService {
    DailyGoal getGoalsByUserId(Integer userId);
    void updateGoals(Integer userId, DailyGoal dto);
}
