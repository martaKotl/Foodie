package com.project.foodie.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyGoalRepository extends JpaRepository<DailyGoalEntity, Integer> {

    DailyGoalEntity findByUserId(Integer userId);
}
