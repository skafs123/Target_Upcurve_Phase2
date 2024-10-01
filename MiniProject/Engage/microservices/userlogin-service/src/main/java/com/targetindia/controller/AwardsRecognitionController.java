package com.targetindia.controller;

import com.targetindia.entity.AwardsRecognition;
import com.targetindia.service.AwardsRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/awardsrecognitions")
public class AwardsRecognitionController {
    @Autowired
    private AwardsRecognitionService awardsRecognitionService;


    @GetMapping
    public List<AwardsRecognition> getAllAwardsRecognitions() {
        return awardsRecognitionService.getAllAwardsRecognitions();
    }
}
