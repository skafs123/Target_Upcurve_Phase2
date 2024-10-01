package com.targetindia.controller;

import com.targetindia.entity.CoreValue;
import com.targetindia.service.CoreValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/corevalues")
@Validated
@CrossOrigin
public class CoreValueController {

    @Autowired
    private CoreValueService service;


    @GetMapping
    public List<CoreValue> getAllCoreValues() {

        return service.getAllCoreValues();
    }
}
