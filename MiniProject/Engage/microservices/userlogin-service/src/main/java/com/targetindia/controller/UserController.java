package com.targetindia.controller;

import com.targetindia.dto.UserDTO;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.model.StatusMsg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.targetindia.entity.User;
import com.targetindia.service.UserService;



@RestController
@RequestMapping("/userlogin")
@Validated
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;



    @PostMapping(path = "/login")
    public ResponseEntity handlePostLogin(@RequestBody User user) {
        try {
            UserDTO resUser = service.validateUser(user);
            if (resUser.getStatus() == 1) {
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            }
            else throw new ResourceNotFoundException(resUser.getMessage());

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }
    @PostMapping(path = "/forgot-password")
    public ResponseEntity handlePostForgotPassword(@RequestBody User user) {
        try {
            UserDTO resUser = service.sendOTP(user);
            if (resUser.getStatus()  == 1)
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            else throw new ResourceNotFoundException(resUser.getMessage());

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }

    @PostMapping(path = "/validate-otp")
    public ResponseEntity handlePostValidateOtp(@RequestBody UserDTO user) {
        try {
            UserDTO resUser = service.validateOTP(user);
            if (resUser.getStatus() == 1)
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            else throw new ResourceNotFoundException(resUser.getMessage());

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }

    @PostMapping(path = "/change-password")
    public ResponseEntity handlePostChangePassword(@RequestBody User user) {
        try {
            UserDTO resUser = service.changePassword(user);
            if (resUser.getStatus() == 1)
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            else throw new ResourceNotFoundException(resUser.getMessage());


        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }




}

