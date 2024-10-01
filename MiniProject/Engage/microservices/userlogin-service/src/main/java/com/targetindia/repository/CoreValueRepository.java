package com.targetindia.repository;

import com.targetindia.entity.CoreValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoreValueRepository extends JpaRepository<CoreValue, Integer> {
}
