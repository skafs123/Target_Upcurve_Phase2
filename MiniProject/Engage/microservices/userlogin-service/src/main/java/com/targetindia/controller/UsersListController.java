package com.targetindia.controller;

import com.targetindia.dto.PartialUserDTO;
import com.targetindia.entity.PartialUser;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.service.DetailedUserService;
import com.targetindia.service.PartialUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
@Validated
@CrossOrigin
public class UsersListController {
    @Autowired
    private PartialUserService service;



    //Get the  List of users for the teamId
    @GetMapping(path = "/partial/{teamId}")
    public ResponseEntity handleGetUsers(@PathVariable Integer teamId) {
        try {

            List<PartialUserDTO> pUsers= service.getPartialUsers(teamId);
            if (pUsers!= null) {
                return ResponseEntity.status(HttpStatus.OK).body(pUsers);
            } else throw new ResourceNotFoundException("Users not found for the team");

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
}