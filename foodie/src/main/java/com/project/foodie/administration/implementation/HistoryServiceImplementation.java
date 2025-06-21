package com.project.foodie.administration.implementation;

import com.project.foodie.administration.HistoryService;
import com.project.foodie.database.HistoryMealEntity;
import com.project.foodie.database.HistoryMealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryServiceImplementation implements HistoryService {

    private final HistoryMealRepository historyMealRepository;

    @Autowired
    public HistoryServiceImplementation(HistoryMealRepository historyMealRepository) {
        this.historyMealRepository = historyMealRepository;
    }

    @Override
    public List<HistoryMealEntity> getHistoryMealsByUserId(Integer userId) {
        return historyMealRepository.findByUserId(userId);
    }
}
