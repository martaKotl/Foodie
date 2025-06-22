package com.project.foodie.administration.implementation;


import com.project.foodie.administration.MealService;
import com.project.foodie.database.*;
import com.project.foodie.administration.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;

import java.util.List;
import java.util.Optional;

@Service
public class MealServiceImplementation implements MealService {

    private final MealRepository mealRepository;
    private final HistoryMealRepository historyMealRepository;

    @Autowired
    public MealServiceImplementation(final MealRepository mealRepository, final HistoryMealRepository historyMealRepository) {
        this.mealRepository = mealRepository;
        this.historyMealRepository = historyMealRepository;
    }

    @Override
    public ResultMessage addMeal(Meal meal) {
        try {
            meal.setCreatedAt(new Date());
            final MealEntity mealEntity = mealToMealEntity(meal);
            final MealEntity savedMealEntity = mealRepository.save(mealEntity);
            String message = "Meal was added";
            return new ResultMessage(message,true);
        } catch (Exception e) {
            String message = "Error during meal adding";
            return new ResultMessage(message,false);
        }
    }

    @Override
    public ResultMessage addHistoryMeal(HistoryMealEntity historyMealEntity) {
        try {
            final HistoryMealEntity savedHistoryMealEntity = historyMealRepository.save(historyMealEntity);
            String message = "Meal was added to history";
            return new ResultMessage(message,true);
        } catch (Exception e) {
            String message = "Error during meal adding to history";
            return new ResultMessage(message,false);
        }
    }

    @Transactional
    @Override
    public ResultMessage deleteMealsByUserId(Integer userId) {
        try {
            List<MealEntity> usersMeals = getMealsByUserId(userId);
            if (usersMeals != null) {
                for (MealEntity meal : usersMeals) {
                    HistoryMealEntity toAdd = mealEntityToHistoryMealEntity(meal);
                    toAdd.setId(null);
                    historyMealRepository.save(toAdd);
                }
            }
            mealRepository.deleteByUserId(userId);
            return new ResultMessage("All meals deleted successfully", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultMessage("Failed to delete meals", false);
        }
    }


    @Transactional
    @Override
    public ResultMessage editMeal(Integer id, Meal editedMeal) {
        Optional<MealEntity> existing = mealRepository.findById(id);
        if (existing.isEmpty()) {
            return new ResultMessage("Meal not found", false);
        }
        try {
            MealEntity entity = existing.get();
            entity.setName(editedMeal.getName());
            entity.setWeightGrams(editedMeal.getWeightGrams());
            entity.setCalories(editedMeal.getCalories());
            entity.setFat(editedMeal.getFat());
            entity.setCarbs(editedMeal.getCarbs());
            entity.setFiber(editedMeal.getFiber());
            entity.setProtein(editedMeal.getProtein());
            entity.setSalt(editedMeal.getSalt());
            entity.setUserId(editedMeal.getUserId());

            mealRepository.save(entity);
            return new ResultMessage("Meal updated successfully", true);
        } catch (Exception e) {
            return new ResultMessage("Error updating meal", false);
        }
    }

    @Override
    public List<MealEntity> getMealsByUserId(Integer userId) {
        try {
            return mealRepository.findByUserId(userId);
        } catch (Exception e) {
            return null;
        }
    }

    private MealEntity mealToMealEntity(Meal meal) {
        MealEntity.MealEntityBuilder builder = MealEntity.builder()
                .userId(meal.getUserId())
                .name(meal.getName())
                .calories(meal.getCalories())
                .protein(meal.getProtein())
                .carbs(meal.getCarbs())
                .fat(meal.getFat())
                .weightGrams(meal.getWeightGrams())
                .createdAt(meal.getCreatedAt())
                .fiber(meal.getFiber())
                .salt(meal.getSalt());

        if (meal.getId() != null) {
            builder.id(meal.getId());
        }

        return builder.build();
    }

    private Meal mealEntityToMeal(MealEntity mealEntity) {
         Meal.MealBuilder builder =Meal.builder()
                .userId(mealEntity.getUserId())
                .name(mealEntity.getName())
                .calories(mealEntity.getCalories())
                .protein(mealEntity.getProtein())
                .carbs(mealEntity.getCarbs())
                .fat(mealEntity.getFat())
                .weightGrams(mealEntity.getWeightGrams())
                .createdAt(mealEntity.getCreatedAt())
                .fiber(mealEntity.getFiber())
                .salt(mealEntity.getSalt());

        if (mealEntity.getId() != null) {
            builder.id(mealEntity.getId());
        }


        return builder.build();
    }

    private HistoryMealEntity mealEntityToHistoryMealEntity(MealEntity mealEntity) {
        HistoryMealEntity.HistoryMealEntityBuilder builder =HistoryMealEntity.builder()
                .userId(mealEntity.getUserId())
                .name(mealEntity.getName())
                .calories(mealEntity.getCalories())
                .protein(mealEntity.getProtein())
                .carbs(mealEntity.getCarbs())
                .fat(mealEntity.getFat())
                .weightGrams(mealEntity.getWeightGrams())
                .createdAt(mealEntity.getCreatedAt())
                .fiber(mealEntity.getFiber())
                .salt(mealEntity.getSalt());

        if (mealEntity.getId() != null) {
            builder.id(mealEntity.getId());
        }
        return builder.build();
    }
}
