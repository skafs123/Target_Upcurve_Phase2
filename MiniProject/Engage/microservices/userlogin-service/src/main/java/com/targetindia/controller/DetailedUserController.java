package com.targetindia.controller;

import com.targetindia.dto.DetailedUserDTO;
import com.targetindia.dto.UserDTO;
import com.targetindia.entity.DetailedUser;
import com.targetindia.entity.User;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.service.DetailedUserService;
import com.targetindia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/user-info")
@Validated
@CrossOrigin
public class DetailedUserController {
    @Autowired
    private DetailedUserService service;

    @GetMapping(path = "/{id}")
    public ResponseEntity handleGetUser(@PathVariable Integer id) {
        try {

            DetailedUserDTO resUser = service.getDetailedUser(id);
            if (resUser.getStatus() == 1) {
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            } else throw new ResourceNotFoundException(resUser.getMessage());

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @PatchMapping(path = "/save-image")
    public ResponseEntity handlePatchImage(@RequestBody DetailedUserDTO user) {
        try {
            DetailedUserDTO resUser = service.updatePicture(user);
            if (resUser.getStatus() == 1) {
                return ResponseEntity.status(HttpStatus.OK).body(resUser);
            } else throw new ResourceNotFoundException(resUser.getMessage());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }


}

