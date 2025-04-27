package com.project.foodie.administration;

import lombok.Getter;
import lombok.Setter;

public class RegisterMessage {
    @Getter @Setter
    public String message;
    public Boolean success;

    public RegisterMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}
