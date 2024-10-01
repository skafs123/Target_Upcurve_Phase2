package com.targetindia.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;


@Data
public class UserList {
    @JsonProperty("users")
    private List<User> users;
}
