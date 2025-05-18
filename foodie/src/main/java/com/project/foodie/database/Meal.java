package com.project.foodie.database;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Meal {
    private Integer id;
    private Integer userId;
    private String name;
    private BigDecimal calories;
    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private BigDecimal weightGrams;
    private Date createdAt;
    private BigDecimal fiber;
    private BigDecimal salt;
}
