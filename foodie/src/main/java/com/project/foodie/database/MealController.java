package com.project.foodie.database;

import com.project.foodie.administration.MealService;
import com.project.foodie.administration.ResultMessage;
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
    public ResponseEntity<ResultMessage> addMeal(@RequestBody Meal meal) {

        try {
            ResultMessage result = mealService.addMeal(meal);
            if (result.getSuccess()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
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

            if (!meals.isEmpty()) {
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

    @PutMapping("/edit/{mealId}")
    public ResponseEntity<ResultMessage> editMeal(@PathVariable Integer mealId, @RequestBody Meal editedMeal){
        try {
            ResultMessage result  = mealService.editMeal(mealId, editedMeal);
            if (result.getSuccess()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResultMessage("Error updating meal", false, null)
            );
        }
    }
}
