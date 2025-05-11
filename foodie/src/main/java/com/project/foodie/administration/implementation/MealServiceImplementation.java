package com.project.foodie.administration.implementation;

import ch.qos.logback.classic.Logger;
import com.project.foodie.administration.MealService;
import com.project.foodie.database.MealEntity;
import com.project.foodie.database.MealRepository;
import com.project.foodie.administration.ResultMessage;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MealServiceImplementation implements MealService {

    private static final Logger logger = (Logger) LoggerFactory.getLogger(MealService.class);
    private final MealRepository mealRepository;

    @Autowired
    public MealServiceImplementation(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @Override
    public MealEntity addMeal(MealEntity mealEntity) {
        try {
            // Save the meal to the database
            mealRepository.save(mealEntity);
            return mealEntity; // Returning the saved meal entity, which includes the meal ID
        } catch (Exception e) {

            // Handle exception here, maybe log it
            return null;
        }
    }

    @Transactional
    @Override
    public ResultMessage deleteMealsByUserId(Integer userId) {
        try {
            mealRepository.deleteByUserId(userId); // Fixed method name here
            return new ResultMessage("All meals deleted successfully", true);
        } catch (Exception e) {

            logger.error("Failed to delete meals for user with ID: " + userId, e);
            return new ResultMessage("Failed to delete meals", false);
        }
    }

    @Override
    public List<MealEntity> getMealsByUserId(Integer userId) {
        try {
            return mealRepository.findByUserId(userId); // Fetching meals for the given user ID
        } catch (Exception e) {
            return null; // Handle error and return null if fetching meals fails
        }
    }
}
