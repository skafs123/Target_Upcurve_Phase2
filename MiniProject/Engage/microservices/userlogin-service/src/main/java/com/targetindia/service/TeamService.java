package com.targetindia.service;

import com.targetindia.entity.Team;
import com.targetindia.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    public Integer getPyramidIdByTeamId(int teamId) {
        return teamRepository.findById(teamId)
                .map(team -> team.getPyramidID() != null ? team.getPyramidID().getPyramidId() : null)
                .orElseThrow(() -> new IllegalArgumentException("Invalid teamId: " + teamId));
    }
}
