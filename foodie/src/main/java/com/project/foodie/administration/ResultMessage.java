package com.project.foodie.administration;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResultMessage {
    public String message;
    public Boolean success;

    public ResultMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}
