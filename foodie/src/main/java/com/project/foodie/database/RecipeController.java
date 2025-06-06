package com.project.foodie.database;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<ResultMessage> getAllRecipes() {
        List<RecipeEntity> recipes = recipeService.getAllRecipes();

        if (recipes.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new ResultMessage("No recipes found", false)
            );
        }

        return ResponseEntity.ok(
                new ResultMessage("Recipes retrieved successfully", true, recipes)
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(recipe -> ResponseEntity.ok().body(recipe))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        new ResultMessage("Recipe not found", false)
                ));
    }
}
