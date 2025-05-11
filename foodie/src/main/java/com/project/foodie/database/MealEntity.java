package com.project.foodie.database;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "meals")
@Getter @Setter
public class MealEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // FOREIGN KEY (user_id) REFERENCES users(id)
    private UserEntity user;

    @Column(name = "recipe_id")
    private Integer recipeId;  // Optional: Could be null if it's a custom meal

    @Column(nullable = false)
    private String name;

    @Column(precision = 10, scale = 2)
    private BigDecimal calories;

    @Column(precision = 10, scale = 2)
    private BigDecimal protein;

    @Column(precision = 10, scale = 2)
    private BigDecimal carbs;

    @Column(precision = 10, scale = 2)
    private BigDecimal fat;

    @Column(name = "weight_grams", precision = 10, scale = 2)
    private BigDecimal weightGrams;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false)
    private Date createdAt = new Date();  // Default value similar to now()

    @Column(precision = 10, scale = 2)
    private BigDecimal fiber;

    @Column(precision = 10, scale = 2)
    private BigDecimal salt;
}
