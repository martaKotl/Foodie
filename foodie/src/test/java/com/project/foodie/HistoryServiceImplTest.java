package com.project.foodie;

import com.project.foodie.administration.implementation.HistoryServiceImplementation;
import com.project.foodie.database.HistoryMealEntity;
import com.project.foodie.database.HistoryMealRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HistoryServiceImplTest {

    @Mock
    private HistoryMealRepository historyMealRepository;

    @InjectMocks
    private HistoryServiceImplementation historyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetHistoryMealsByUserId_ReturnsCorrectList() {
        HistoryMealEntity meal1 = HistoryMealEntity.builder()
                .id(1)
                .userId(42)
                .name("Chicken")
                .build();

        HistoryMealEntity meal2 = HistoryMealEntity.builder()
                .id(2)
                .userId(42)
                .name("Rice")
                .build();

        List<HistoryMealEntity> mockResult = List.of(meal1, meal2);
        when(historyMealRepository.findByUserId(42)).thenReturn(mockResult);

        List<HistoryMealEntity> result = historyService.getHistoryMealsByUserId(42);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Chicken", result.get(0).getName());
        assertEquals("Rice", result.get(1).getName());
        verify(historyMealRepository, times(1)).findByUserId(42);
    }

    @Test
    void testGetHistoryMealsByUserId_EmptyList() {
        when(historyMealRepository.findByUserId(anyInt())).thenReturn(List.of());

        List<HistoryMealEntity> result = historyService.getHistoryMealsByUserId(123);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(historyMealRepository).findByUserId(123);
    }
}
