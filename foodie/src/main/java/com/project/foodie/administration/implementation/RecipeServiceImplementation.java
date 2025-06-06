package com.project.foodie.administration.implementation;

import com.project.foodie.administration.RecipeService;
import com.project.foodie.database.RecipeEntity;
import com.project.foodie.database.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeServiceImplementation implements RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeServiceImplementation(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public List<RecipeEntity> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Override
    public Optional<RecipeEntity> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }
}