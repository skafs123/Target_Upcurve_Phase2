package com.targetindia.repository;

import com.targetindia.entity.ARBehaviours;
import com.targetindia.entity.ARBehavioursPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



@Repository
public interface ARBehavioursRepository extends JpaRepository<ARBehaviours, ARBehavioursPK> {
    List<ARBehaviours> findByPostId(Integer id);

    List<ARBehaviours> findByPostIdIn(List<Integer> postIds);
}
