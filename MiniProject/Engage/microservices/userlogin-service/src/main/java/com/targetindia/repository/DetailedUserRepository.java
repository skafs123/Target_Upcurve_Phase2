package com.targetindia.repository;

import com.targetindia.entity.DetailedUser;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailedUserRepository extends CrudRepository<DetailedUser, Integer> {

    @Modifying
    @Query("UPDATE DetailedUser u SET u.pointsReceived = u.pointsReceived + :points WHERE u.id = :id")
    void updatePoints(@Param("id") Long id, @Param("points") int points);

    @Query("SELECT u FROM DetailedUser u WHERE u.team.id = :teamId")
    List<DetailedUser> findUsersByTeamId(Integer teamId);

    @Query("SELECT u FROM DetailedUser u WHERE u.team.pyramidID = :pyramidId")
    List<DetailedUser> findUsersByPyramidId(Integer pyramidId);

}
