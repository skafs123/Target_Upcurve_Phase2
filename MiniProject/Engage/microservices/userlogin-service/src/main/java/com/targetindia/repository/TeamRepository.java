package com.targetindia.repository;


import com.targetindia.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {

    Optional<Team> findById(Integer id);
    @Query("SELECT t.id FROM Team t WHERE t.pyramidID = :pyramidID")
    List<Long> findTeamIdsByPyramidId(@Param("pyramidID") Long pyramidId);
}