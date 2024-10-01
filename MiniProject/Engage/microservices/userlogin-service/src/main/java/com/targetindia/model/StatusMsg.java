package com.targetindia.model;

import lombok.Data;

import java.util.Date;

@Data
public class StatusMsg {
    private String message;
    public StatusMsg(String message) {
        this.message = message;
    }
}
