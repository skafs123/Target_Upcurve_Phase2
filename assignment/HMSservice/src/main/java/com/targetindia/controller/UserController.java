package com.targetindia.controller;

import com.targetindia.entity.UserList;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.targetindia.entity.User;
import com.targetindia.model.ErrorResponse;
import com.targetindia.service.UserService;
import com.targetindia.service.ServiceException;


@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    @Autowired
    private UserService service;


    @GetMapping(path = "/{id}", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity handleGetOne(@PathVariable Integer id){
        User user = service.getUser(id);
        if(user==null){
            return ResponseEntity.status(404).body(new ErrorResponse("no data found"));
        }
        return ResponseEntity.ok(user);
    }


    @PostMapping(path = "/login" )
    public ResponseEntity handlePostOne( @RequestBody User user) {
        try {
            int success = service.validateUser(user);
            if ( success == 1)
                return ResponseEntity.status(HttpStatus.OK).body("Login successful");
            else if (success == 2) {
                return ResponseEntity.status(404).body("invalid password");
            }
            else {
                return ResponseEntity.status(404).body("invalid user/email");
            }
        }
        catch (Exception ex)
        {
            return ResponseEntity.status(404).body(new ErrorResponse(ex.getMessage()));
        }

    }

 /*   @GetMapping
    public ResponseEntity handleGetAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(name="sort_by", defaultValue = "name") String sortBy){
        return ResponseEntity.ok(service.getAllUser(page, size, sortBy));
    }
*/



    @GetMapping(produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity handleGetAll(){
        return ResponseEntity.ok(new UserList(service.getAllUser()));
    }


/*
    @GetMapping("/search")
    public ResponseEntity handleGetBySearchType(@RequestParam(name="search_type" ) String searchType,@RequestParam(name="key" ) String searchKey){
        if(searchType.equals("city"))
            return ResponseEntity.ok(service.getCustomersByCity(searchKey));
        if(searchType.equals("name"))
            return ResponseEntity.ok( service.getCustomersByName(searchKey));
        if(searchType.equals("email"))
            return ResponseEntity.ok(service.getCustomerByEmail(searchKey));
        if(searchType.equals("phone"))
            return ResponseEntity.ok(service.getCustomerByPhone(searchKey));
        //return Collections.singletonList(service.getCustomerByPhone(searchKey));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("customer not found"));
    }
*/
}