package com.project.foodie.database;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DailyGoal {

    private BigDecimal calories;
    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private Integer water;
}
