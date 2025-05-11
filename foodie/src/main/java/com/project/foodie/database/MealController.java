package com.project.foodie.database;

import com.project.foodie.administration.MealService;
import com.project.foodie.administration.ResultMessage;
import com.project.foodie.database.MealEntity;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:3000")
public class MealController {

    private final MealService mealService;

    @Autowired
    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping("/add")
    public ResponseEntity<ResultMessage> addMeal(@RequestBody MealEntity mealEntity) {

        try {
            MealEntity addedMeal = mealService.addMeal(mealEntity);
            if (addedMeal != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(
                        new ResultMessage("Meal added successfully", true)
                );
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        new ResultMessage("Failed to add meal", false)
                );
            }
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResultMessage("Error adding meal", false)
            );
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResultMessage> getMealsByUserId(@PathVariable Integer userId) {
        try {
            List<MealEntity> meals = mealService.getMealsByUserId(userId);

            if (!meals.isEmpty()) {  // Instead of checking null, check if the list is empty
                return ResponseEntity.ok(new ResultMessage("Meals retrieved successfully", true, meals));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ResultMessage("No meals found for the user", false, null)
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResultMessage("Error retrieving meals", false, null)
            );
        }
    }



    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<ResultMessage> deleteMealsByUserId(@PathVariable Integer userId) {
        ResultMessage result = mealService.deleteMealsByUserId(userId);
        if (result.getSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}
