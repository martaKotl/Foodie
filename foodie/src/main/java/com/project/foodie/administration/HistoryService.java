package com.project.foodie.administration;

import com.project.foodie.database.HistoryMealEntity;
import java.util.List;

public interface HistoryService {

    List<HistoryMealEntity> getHistoryMealsByUserId(Integer userId);
}
