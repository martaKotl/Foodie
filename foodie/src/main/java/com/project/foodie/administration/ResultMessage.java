package com.project.foodie.administration;

import lombok.Getter;
import lombok.Setter;

public class ResultMessage {
    @Getter @Setter
    public String message;
    public Boolean success;

    public ResultMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}
