package com.targetindia.repository;

import com.targetindia.entity.PartialUser;
import com.targetindia.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    Optional<Post> findById(Integer id);
    Page<Post> findAllByOrderByPostDateDesc(Pageable pageable);
    List<Post> findByRecognizerIn(List<PartialUser> users);
    List<Post> findByPostType(String postType);
    List<Post> findByPostIdIn(List<Integer> postIds);
    @Query(value = "SELECT p.* FROM Posts p " +
            "JOIN Users u ON p.RecognizerID = u.UserID " +
            "WHERE u.TeamID = :teamId",
            nativeQuery = true)
    List<Post> findByTeamId(@Param("teamId") int teamId);
    @Query(value = "SELECT p.* FROM Posts p " +
            "JOIN Users u ON p.RecognizerID = u.UserID " +
            "JOIN Teams t ON u.TeamID = t.TeamID " +
            "WHERE t.PyramidID = :pyramidId",
            nativeQuery = true)
    List<Post> findByPyramidId(@Param("pyramidId") int pyramidId);
    @Query("SELECT p FROM Post p " +
            "JOIN p.recognizer r " +
            "JOIN Team t1 ON r.teamId = t1.id " +
            "JOIN Team t2 ON t2.id = :teamID " +
            "WHERE t1.pyramidID = t2.pyramidID")
    List<Post> findPostsByTeamPyramid(Integer teamID);
    @Query("SELECT p FROM Post p JOIN Recognizee r ON p.id = r.postId WHERE r.user.id = :userId")
    List<Post> findPostsWhereUserIsRecognized(@Param("userId") int userId);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.recognizer.id = :recognizerID AND p.postType = 'Recognition' AND p.postDate >= :startDate AND p.postDate <= :endDate")
    int countShoutoutsGivenBetweenDates(@Param("recognizerID") Integer recognizerID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.awardValue.points) FROM Post p WHERE p.recognizer.id = :recognizerID AND p.postType = 'Recognition' AND p.postDate >= :startDate AND p.postDate <= :endDate")
    Integer pointsShoutoutsGivenBetweenDates(@Param("recognizerID") Integer recognizerID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM Post p JOIN Recognizee r ON p.id = r.postId WHERE r.user.id = :recognizeeID AND p.postType = 'Recognition' AND p.postDate >= :startDate AND p.postDate <= :endDate")
    int countShoutoutsReceivedBetweenDates(@Param("recognizeeID") Integer recognizeeID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.awardValue.points) FROM Post p JOIN Recognizee r ON p.id = r.postId WHERE r.user.id = :recognizeeID AND p.awardValue.arID = 4 AND p.postDate >= :startDate AND p.postDate <= :endDate")
    Integer pointsShoutoutsReceivedBetweenDates(@Param("recognizeeID") Integer recognizeeID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(p) FROM Post p JOIN Recognizee r ON p.id = r.postId WHERE r.user.id = :recognizeeID AND p.postType = 'Award' AND p.postDate >= :startDate AND p.postDate <= :endDate")
    int countAwardsReceivedBetweenDates(@Param("recognizeeID") Integer recognizeeID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(p.awardValue.points) FROM Post p JOIN Recognizee r ON p.id = r.postId WHERE r.user.id = :recognizeeID AND p.postType = 'Award' AND p.postDate >= :startDate AND p.postDate <= :endDate")
    Integer pointsAwardsReceivedBetweenDates(@Param("recognizeeID") Integer recognizeeID, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Post p WHERE p.recognizer.id = :recognizerId AND (p.postType = 'Award' OR p.postType = 'Recognition') AND p.postDate >= :startDate AND p.postDate <= :endDate")
    List<Post> findByRecognizerIdBetweenDates(@Param("recognizerId") Integer recognizerId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT p FROM Post p JOIN p.recognizees r WHERE r.user.id = :recognizeeId AND (p.postType = 'Award' OR p.postType = 'Recognition') AND p.postDate >= :startDate AND p.postDate <= :endDate")
    List<Post> findByRecognizeesIdBetweenDates(@Param("recognizeeId") Integer recognizeeId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}