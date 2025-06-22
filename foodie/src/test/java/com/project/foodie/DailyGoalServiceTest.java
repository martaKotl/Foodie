package com.project.foodie;

import com.project.foodie.administration.implementation.DailyGoalServiceImplementation;
import com.project.foodie.database.DailyGoal;
import com.project.foodie.database.DailyGoalEntity;
import com.project.foodie.database.DailyGoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.math.BigDecimal;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DailyGoalServiceImplementationTest {

    @Mock
    private DailyGoalRepository dailyGoalRepository;

    @InjectMocks
    private DailyGoalServiceImplementation dailyGoalService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetGoalsByUserId_ReturnsDailyGoal() {
        DailyGoalEntity entity = DailyGoalEntity.builder()
                .userId(1)
                .calories(BigDecimal.valueOf(2000))
                .protein(BigDecimal.valueOf(150))
                .carbs(BigDecimal.valueOf(250))
                .fat(BigDecimal.valueOf(70))
                .water(2000)
                .build();

        when(dailyGoalRepository.findByUserId(1)).thenReturn(entity);

        DailyGoal result = dailyGoalService.getGoalsByUserId(1);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(2000), result.getCalories());
        assertEquals(BigDecimal.valueOf(150), result.getProtein());
        assertEquals(BigDecimal.valueOf(250), result.getCarbs());
        assertEquals(BigDecimal.valueOf(70), result.getFat());
        assertEquals(2000, result.getWater());

        verify(dailyGoalRepository).findByUserId(1);
    }

    @Test
    void testGetGoalsByUserId_ReturnsNullWhenNoData() {
        when(dailyGoalRepository.findByUserId(2)).thenReturn(null);

        DailyGoal result = dailyGoalService.getGoalsByUserId(2);

        assertNull(result);
        verify(dailyGoalRepository).findByUserId(2);
    }

    @Test
    void testUpdateGoals_UpdatesExistingEntity() {
        DailyGoalEntity existingEntity = new DailyGoalEntity();
        existingEntity.setUserId(3);

        DailyGoal dto = new DailyGoal();
        dto.setCalories(BigDecimal.valueOf(1800));
        dto.setProtein(BigDecimal.valueOf(120));
        dto.setCarbs(BigDecimal.valueOf(200));
        dto.setFat(BigDecimal.valueOf(60));
        dto.setWater(2500);

        when(dailyGoalRepository.findByUserId(3)).thenReturn(existingEntity);

        dailyGoalService.updateGoals(3, dto);

        assertEquals(BigDecimal.valueOf(1800), existingEntity.getCalories());
        assertEquals(BigDecimal.valueOf(120), existingEntity.getProtein());
        assertEquals(BigDecimal.valueOf(200), existingEntity.getCarbs());
        assertEquals(BigDecimal.valueOf(60), existingEntity.getFat());
        assertEquals(2500, existingEntity.getWater());

        verify(dailyGoalRepository).save(existingEntity);
    }

    @Test
    void testUpdateGoals_CreatesNewEntityWhenNotExists() {
        DailyGoal dto = new DailyGoal();
        dto.setCalories(BigDecimal.valueOf(1600));
        dto.setProtein(BigDecimal.valueOf(100));
        dto.setCarbs(BigDecimal.valueOf(180));
        dto.setFat(BigDecimal.valueOf(50));
        dto.setWater(2200);

        when(dailyGoalRepository.findByUserId(4)).thenReturn(null);

        dailyGoalService.updateGoals(4, dto);

        ArgumentCaptor<DailyGoalEntity> captor = ArgumentCaptor.forClass(DailyGoalEntity.class);
        verify(dailyGoalRepository).save(captor.capture());

        DailyGoalEntity savedEntity = captor.getValue();

        assertEquals(4, savedEntity.getUserId());
        assertEquals(BigDecimal.valueOf(1600), savedEntity.getCalories());
        assertEquals(BigDecimal.valueOf(100), savedEntity.getProtein());
        assertEquals(BigDecimal.valueOf(180), savedEntity.getCarbs());
        assertEquals(BigDecimal.valueOf(50), savedEntity.getFat());
        assertEquals(2200, savedEntity.getWater());
    }
}