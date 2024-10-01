package com.targetindia.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class User {

    private String id;
    @JsonProperty("name")
    private String fullName;
    @JsonProperty("email")
    private String emailAddress;
    @JsonProperty("phone")
    private String phoneNumber;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


}