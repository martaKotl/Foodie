package com.project.foodie.administration.implementation;


import com.project.foodie.administration.MealService;
import com.project.foodie.database.MealEntity;
import com.project.foodie.database.MealRepository;
import com.project.foodie.administration.ResultMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MealServiceImplementation implements MealService {

    private final MealRepository mealRepository;

    @Autowired
    public MealServiceImplementation(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @Override
    public MealEntity addMeal(MealEntity mealEntity) {
        try {
            mealRepository.save(mealEntity);
            return mealEntity;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    @Override
    public ResultMessage deleteMealsByUserId(Integer userId) {
        try {
            mealRepository.deleteByUserId(userId);
            return new ResultMessage("All meals deleted successfully", true);
        } catch (Exception e) {
            return new ResultMessage("Failed to delete meals", false);
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
}
