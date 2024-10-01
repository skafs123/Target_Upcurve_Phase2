package com.targetindia.controller;

import com.targetindia.dto.DetailedUserDTO;
import com.targetindia.entity.DetailedUser;
import com.targetindia.entity.User;
import com.targetindia.service.TopPerformerService;
import com.targetindia.service.UserService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.io.IOException;

@RestController
@RequestMapping("/users/top-performers")
@CrossOrigin
public class TopPerformerController {
    @Autowired
    private TopPerformerService topPerformerService;

    @GetMapping("/team/{teamId}")
    public List<DetailedUserDTO> getUsersByTeamId(@PathVariable Integer teamId) throws IOException {
        return topPerformerService.getUsersByTeamId(teamId);
    }

    @GetMapping("/pyramid/{pyramidId}")
    public List<DetailedUserDTO> getUsersByPyramidId(@PathVariable Integer pyramidId) throws IOException {
        return topPerformerService.getUsersByPyramidId(pyramidId);
    }

}
