package com.project.foodie;

import com.project.foodie.administration.implementation.RecipeServiceImplementation;
import com.project.foodie.database.RecipeEntity;
import com.project.foodie.database.RecipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class RecipeServiceImplementationTest {

    private RecipeRepository recipeRepository;
    private RecipeServiceImplementation recipeService;

    @BeforeEach
    void setUp() {
        recipeRepository = mock(RecipeRepository.class);
        recipeService = new RecipeServiceImplementation(recipeRepository);
    }

    @Test
    void testGetAllRecipes() {
        RecipeEntity recipe = new RecipeEntity();
        recipe.setId(1L);
        recipe.setName("Pizza");

        when(recipeRepository.findAll()).thenReturn(List.of(recipe));

        List<RecipeEntity> result = recipeService.getAllRecipes();

        assertEquals(1, result.size());
        assertEquals("Pizza", result.get(0).getName());
    }

    @Test
    void testGetRecipeById_Exists() {
        RecipeEntity recipe = new RecipeEntity();
        recipe.setId(2L);
        recipe.setName("Sushi");

        when(recipeRepository.findById(2L)).thenReturn(Optional.of(recipe));

        Optional<RecipeEntity> result = recipeService.getRecipeById(2L);

        assertTrue(result.isPresent());
        assertEquals("Sushi", result.get().getName());
    }

    @Test
    void testGetRecipeById_NotFound() {
        when(recipeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<RecipeEntity> result = recipeService.getRecipeById(999L);

        assertFalse(result.isPresent());
    }
}
