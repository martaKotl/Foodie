package com.project.foodie.database;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "recipes")
@Getter @Setter
public class RecipeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "calories_per_100g", precision = 6, scale = 2)
    private BigDecimal caloriesPer100g;

    @Column(name = "protein_per_100g", precision = 5, scale = 2)
    private BigDecimal proteinPer100g;

    @Column(name = "carbs_per_100g", precision = 5, scale = 2)
    private BigDecimal carbsPer100g;

    @Column(name = "fat_per_100g", precision = 5, scale = 2)
    private BigDecimal fatPer100g;

    @Column(name = "diet_category", length = 50)
    private String dietCategory;

    @Column(name = "prep_time_minutes")
    private Integer prepTimeMinutes;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String ingredients;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String steps;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(precision = 10, scale = 2)
    private BigDecimal fiber;

    @Column(precision = 10, scale = 2)
    private BigDecimal salt;

    @Column(name = "weight_of_meal")
    private Integer weightOfMeal;
}
