package com.targetindia.service;

import com.targetindia.entity.ARBehaviours;
import com.targetindia.entity.Behaviour;
import com.targetindia.entity.Post;
import com.targetindia.entity.Team;
import com.targetindia.entity.DetailedUser;
import com.targetindia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TrendingBehaviourService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private BehaviourRepository behaviourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    public List<String> getTop5TrendingBehavioursByTeam(int teamId) {
        List<Integer> postIds = postRepository.findByTeamId(teamId).stream()
                .map(Post::getPostId)
                .collect(Collectors.toList());

        return getTop5TrendingBehavioursFromPostIds(postIds);
    }

    public List<String> getTop5TrendingBehavioursByPyramid(int pyramidId) {
        List<Integer> postIds = postRepository.findByPyramidId(pyramidId).stream()
                .map(Post::getPostId)
                .collect(Collectors.toList());

        return getTop5TrendingBehavioursFromPostIds(postIds);
    }

    private List<String> getTop5TrendingBehavioursFromPostIds(List<Integer> postIds) {
        Map<String, Long> behaviourCountMap = postRepository.findByPostIdIn(postIds).stream()
                .flatMap(post -> post.getArBehaviours().stream())
                .collect(Collectors.groupingBy(ab -> ab.getBehaviour().getBehaviourName(), Collectors.counting()));

        return behaviourCountMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public List<String> getTop3TrendingBehavioursByUser(int userId) {
        // Fetch posts where the user is recognized
        List<Integer> postIds = postRepository.findPostsWhereUserIsRecognized(userId).stream()
                .map(Post::getPostId)
                .collect(Collectors.toList());

        // Fetch and return the top 3 behaviors for those posts
        return getTopTrendingBehavioursFromPostIds(postIds, 3);
    }

    private List<String> getTopTrendingBehavioursFromPostIds(List<Integer> postIds, int limit) {
        Map<String, Long> behaviourCountMap = postRepository.findByPostIdIn(postIds).stream()
                .flatMap(post -> post.getArBehaviours().stream())
                .collect(Collectors.groupingBy(ab -> ab.getBehaviour().getBehaviourName(), Collectors.counting()));

        return behaviourCountMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
