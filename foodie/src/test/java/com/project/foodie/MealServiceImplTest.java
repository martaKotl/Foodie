package com.project.foodie;

import com.project.foodie.administration.implementation.MealServiceImplementation;
import com.project.foodie.administration.ResultMessage;
import com.project.foodie.database.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MealServiceImplTest {

    @Mock
    private MealRepository mealRepository;

    @Mock
    private HistoryMealRepository historyMealRepository;

    @InjectMocks
    private MealServiceImplementation mealService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddMeal_Success() {
        Meal meal = new Meal();
        meal.setName("Test Meal");
        meal.setUserId(1);

        MealEntity savedEntity = MealEntity.builder()
                .id(1)
                .name("Test Meal")
                .userId(1)
                .build();

        when(mealRepository.save(any(MealEntity.class))).thenReturn(savedEntity);

        ResultMessage result = mealService.addMeal(meal);

        assertTrue(result.getSuccess());
        assertEquals("Meal was added", result.getMessage());
        verify(mealRepository).save(any(MealEntity.class));
    }

    @Test
    void testAddMeal_Exception() {
        Meal meal = new Meal();
        when(mealRepository.save(any())).thenThrow(new RuntimeException("DB error"));

        ResultMessage result = mealService.addMeal(meal);

        assertFalse(result.getSuccess());
        assertEquals("Error during meal adding", result.getMessage());
    }

    @Test
    void testAddHistoryMeal_Success() {
        HistoryMealEntity entity = new HistoryMealEntity();
        when(historyMealRepository.save(any())).thenReturn(entity);

        ResultMessage result = mealService.addHistoryMeal(entity);

        assertTrue(result.getSuccess());
        assertEquals("Meal was added to history", result.getMessage());
    }

    @Test
    void testAddHistoryMeal_Exception() {
        when(historyMealRepository.save(any())).thenThrow(new RuntimeException());

        ResultMessage result = mealService.addHistoryMeal(new HistoryMealEntity());

        assertFalse(result.getSuccess());
        assertEquals("Error during meal adding to history", result.getMessage());
    }

    @Test
    void testDeleteMealsByUserId_Success() {
        List<MealEntity> meals = List.of(MealEntity.builder().id(1).userId(1).name("Test").build());

        when(mealRepository.findByUserId(1)).thenReturn(meals);
        when(historyMealRepository.save(any())).thenReturn(new HistoryMealEntity());

        ResultMessage result = mealService.deleteMealsByUserId(1);

        assertTrue(result.getSuccess());
        verify(historyMealRepository, times(1)).save(any());
        verify(mealRepository).deleteByUserId(1);
    }

    @Test
    void testDeleteMealsByUserId_Exception() {
        MealServiceImplementation spyService = Mockito.spy(mealService);
        doThrow(new RuntimeException("Simulated DB failure"))
                .when(spyService).getMealsByUserId(anyInt());

        ResultMessage result = spyService.deleteMealsByUserId(1);

        assertFalse(result.getSuccess());
        assertEquals("Failed to delete meals", result.getMessage());
    }

    @Test
    void testEditMeal_Success() {
        MealEntity original = MealEntity.builder().id(1).userId(1).name("Old").build();
        Meal updated = Meal.builder().userId(1).name("New").build();

        when(mealRepository.findById(1)).thenReturn(Optional.of(original));
        when(mealRepository.save(any())).thenReturn(original);

        ResultMessage result = mealService.editMeal(1, updated);

        assertTrue(result.getSuccess());
        verify(mealRepository).save(any());
    }

    @Test
    void testEditMeal_NotFound() {
        when(mealRepository.findById(1)).thenReturn(Optional.empty());

        ResultMessage result = mealService.editMeal(1, new Meal());

        assertFalse(result.getSuccess());
        assertEquals("Meal not found", result.getMessage());
    }

    @Test
    void testGetMealsByUserId_Success() {
        List<MealEntity> meals = List.of(new MealEntity());
        when(mealRepository.findByUserId(1)).thenReturn(meals);

        List<MealEntity> result = mealService.getMealsByUserId(1);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testGetMealsByUserId_Exception() {
        when(mealRepository.findByUserId(1)).thenThrow(new RuntimeException());

        List<MealEntity> result = mealService.getMealsByUserId(1);

        assertNull(result);
    }
}
