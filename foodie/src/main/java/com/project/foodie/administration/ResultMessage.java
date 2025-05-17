package com.project.foodie.administration;


import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class ResultMessage {

    private String message;
    private Boolean success;
    private Object data;

    public ResultMessage(String message, Boolean success) {
        this.message = message;
        this.success = success;
        this.data = null;
    }

    public ResultMessage(String message, Boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }
}
