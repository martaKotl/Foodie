package com.project.foodie.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryMealRepository extends JpaRepository<HistoryMealEntity, Integer> {
    List<HistoryMealEntity> findByUserId(Integer userId);

}
