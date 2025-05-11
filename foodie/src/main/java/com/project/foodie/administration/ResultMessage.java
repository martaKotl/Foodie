package com.project.foodie.administration;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResultMessage {

    private String message;
    private Boolean success;
    private Object data;  // New field for additional data, can be meals, etc.

    // Original constructor for backward compatibility
    public ResultMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
        this.data = null; // Set data to null by default
    }

    // New constructor to handle cases where data is included
    public ResultMessage(String message, Boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }
}
