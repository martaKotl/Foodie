package com.project.foodie.administration;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResultMessage {
    private String message;
    private Boolean success;

    public ResultMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}
