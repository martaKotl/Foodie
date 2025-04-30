package com.project.foodie.database;

import com.project.foodie.administration.RegisterMessage;
import com.project.foodie.administration.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public RegisterMessage register(@RequestBody final User user) {
        return userService.registerUser(user);
    }
}
