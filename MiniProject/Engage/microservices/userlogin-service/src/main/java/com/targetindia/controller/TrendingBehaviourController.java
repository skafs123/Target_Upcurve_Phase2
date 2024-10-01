package com.targetindia.controller;

import com.targetindia.service.TrendingBehaviourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trending/behaviours")
@CrossOrigin
public class TrendingBehaviourController {

    @Autowired
    private TrendingBehaviourService trendingBehaviourService;

    @GetMapping("/team/{teamId}")
    public List<String> getTop4TrendingBehavioursByTeam(@PathVariable("teamId") int teamId) {
        return trendingBehaviourService.getTop5TrendingBehavioursByTeam(teamId);
    }

    @GetMapping("/pyramid/{pyramidId}")
    public List<String> getTop4TrendingBehavioursByPyramid(@PathVariable("pyramidId") int pyramidId) {
        return trendingBehaviourService.getTop5TrendingBehavioursByPyramid(pyramidId);
    }

    @GetMapping("/user/{userId}")
    public List<String> getTop3TrendingBehavioursByUser(@PathVariable("userId") int userId) {
        return trendingBehaviourService.getTop3TrendingBehavioursByUser(userId);
    }
}
