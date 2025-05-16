package com.project.foodie.database;

import com.project.foodie.database.DailyGoal;
import com.project.foodie.administration.DailyGoalService;
import com.project.foodie.administration.ResultMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class DailyGoalController {

    private final DailyGoalService dailyGoalService;

    @GetMapping("/{userId}")
    public ResponseEntity<ResultMessage> getGoals(@PathVariable Integer userId) {
        DailyGoal goal = dailyGoalService.getGoalsByUserId(userId);

        if (goal == null) {
            return ResponseEntity.status(404).body(
                    new ResultMessage("Daily goals not found for user ID: " + userId, false)
            );
        }

        return ResponseEntity.ok(
                new ResultMessage("Daily goals retrieved successfully", true, goal)
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ResultMessage> updateGoals(@PathVariable Integer userId,
                                                     @RequestBody DailyGoal goal) {
        dailyGoalService.updateGoals(userId, goal);

        return ResponseEntity.ok(
                new ResultMessage("Daily goals updated successfully", true)
        );
    }
}
