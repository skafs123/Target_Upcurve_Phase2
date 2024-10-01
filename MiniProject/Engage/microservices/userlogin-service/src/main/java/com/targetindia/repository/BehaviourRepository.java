package com.targetindia.repository;

import com.targetindia.entity.Behaviour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BehaviourRepository extends JpaRepository<Behaviour, Integer> {
    List<Behaviour> findByUserIDOrUserIDIsNull(Integer userID);
    List<Behaviour> findAll();
}
