package com.project.foodie.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<MealEntity, Integer> {

    List<MealEntity> findByUserId(Integer userId);
    void deleteByUserId(Integer userId);
}
