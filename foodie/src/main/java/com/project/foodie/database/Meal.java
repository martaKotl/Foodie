package com.project.foodie.database;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Meal {
    private Integer id;
    private Integer userId;
    private Integer recipeId;
    private String name;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double weightGrams;
    private Date createdAt;
    private Double fiber;
    private Double salt;
}
