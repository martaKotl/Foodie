package com.project.foodie.database;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.RecipeService;
import com.project.foodie.database.RecipeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
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
        Optional<RecipeEntity> recipeOptional = recipeService.getRecipeById(id);

        if (recipeOptional.isPresent()) {
            return ResponseEntity.ok(recipeOptional.get());
        } else {
            return ResponseEntity.status(404).body(
                    new ResultMessage("Recipe not found", false)
            );
        }
    }
}