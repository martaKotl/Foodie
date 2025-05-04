package com.project.foodie.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Integer> {
    Optional<VerificationTokenEntity> findByToken(String token);
}
