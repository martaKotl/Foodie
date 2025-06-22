package com.project.foodie.database;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "daily_goals")
public class DailyGoalEntity {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(precision = 6, scale = 2)
    private BigDecimal calories = new BigDecimal("2000.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal protein = new BigDecimal("50.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal carbs = new BigDecimal("250.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal fat = new BigDecimal("50.00");

    @Column(name = "water_ml")
    private Integer water = 2000;
}
