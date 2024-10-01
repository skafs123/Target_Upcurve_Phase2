package com.targetindia.repository;

import com.targetindia.entity.AwardsRecognition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AwardsRecognitionRepository extends JpaRepository<AwardsRecognition, Integer> {
}