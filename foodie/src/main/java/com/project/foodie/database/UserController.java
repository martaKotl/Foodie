package com.project.foodie.database;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResultMessage> register(@RequestBody User user) {
        ResultMessage result = userService.registerUser(user);

        user.setIsActive(false);
        user.setRegistrationDate(new Date());

        if (result.getSuccess()) {
            return ResponseEntity.ok(result);
        }
        else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}

