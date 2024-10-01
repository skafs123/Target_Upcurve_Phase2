package com.targetindia.repository;

import com.targetindia.dto.DetailedUserDTO;
import com.targetindia.entity.DetailedUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PointsRepository extends CrudRepository<DetailedUser, Integer> {

    @Query(value = "SELECT u.UserID, u.name, u.TeamID, u.ProfilePicture, t.PyramidID, SUM(a.Points) AS TotalPoints " +
            "FROM users u " +
            "JOIN recognizees r ON u.UserID = r.UserID " +
            "JOIN posts p ON r.postID = p.postID " +
            "JOIN awardsrecognitions a ON p.AwardValueID = a.AR_ID " +
            "JOIN teams t ON u.teamId = t.teamId " +
            "WHERE p.postDate >= DATE_FORMAT(CURDATE(), '%Y-%m-01') " +
            "AND p.postDate < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01') " +
            "GROUP BY u.UserID, u.TeamID, t.PyramidID " +
            "ORDER BY TotalPoints DESC",
            nativeQuery = true)
    List<Object[]> findTotalPointsByCriteria();
}
