package com.targetindia.controller;

import com.targetindia.entity.Behaviour;
import com.targetindia.service.BehaviourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/behaviours")
public class BehaviourController {

    @Autowired
    private BehaviourService behaviourService;

    @GetMapping("/{userID}")
    public List<Behaviour> getBehavioursByUserID(@PathVariable Integer userID) {
        return behaviourService.getAllBehavioursByUserID(userID);
    }
}

