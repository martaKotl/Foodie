package com.project.foodie.database;

import com.project.foodie.administration.HistoryService;
import com.project.foodie.database.HistoryMealEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals/history")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryController {

    private final HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/user/{userId}")
    public List<HistoryMealEntity> getHistoryMealsByUserId(@PathVariable Integer userId) {
        return historyService.getHistoryMealsByUserId(userId);
    }
}

