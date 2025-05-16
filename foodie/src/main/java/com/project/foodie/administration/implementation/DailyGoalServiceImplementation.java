package com.project.foodie.administration.implementation;

import com.project.foodie.administration.DailyGoalService;
import com.project.foodie.database.DailyGoalEntity;
import com.project.foodie.database.DailyGoalRepository;
import com.project.foodie.database.UserEntity;
import com.project.foodie.database.DailyGoal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DailyGoalServiceImplementation implements DailyGoalService {

    private final DailyGoalRepository dailyGoalRepository;

    @Override
    public DailyGoal getGoalsByUserId(Integer userId) {
        DailyGoalEntity entity = dailyGoalRepository.findByUserId(userId);
        if (entity == null) return null;

        DailyGoal dto = new DailyGoal();
        dto.setCalories(entity.getCalories());
        dto.setProtein(entity.getProtein());
        dto.setCarbs(entity.getCarbs());
        dto.setFat(entity.getFat());
        dto.setWater(entity.getWater());
        return dto;
    }

    @Override
    public void updateGoals(Integer userId, DailyGoal dto) {
        DailyGoalEntity entity = dailyGoalRepository.findByUserId(userId);
        if (entity == null) {
            entity = new DailyGoalEntity();
            UserEntity user = new UserEntity();
            user.setId(userId);
            entity.setUser(user);
        }

        entity.setCalories(dto.getCalories());
        entity.setProtein(dto.getProtein());
        entity.setCarbs(dto.getCarbs());
        entity.setFat(dto.getFat());
        entity.setWater(dto.getWater());

        dailyGoalRepository.save(entity);
    }
}

