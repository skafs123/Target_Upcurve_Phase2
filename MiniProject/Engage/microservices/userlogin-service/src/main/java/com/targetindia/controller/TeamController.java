package com.targetindia.controller;

import com.targetindia.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/team")
@CrossOrigin
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping("/{teamId}")
    public Map<String, Integer> getPyramidIdByTeamId(@PathVariable int teamId) {
        try {
            int pyramidId = teamService.getPyramidIdByTeamId(teamId);
            return Map.of("pyramidId", pyramidId);
        } catch (IllegalArgumentException e) {
            // Handle the case where the teamId is invalid
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}
