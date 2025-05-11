package com.project.foodie.database;

import com.project.foodie.administration.LoginResponse;
import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody Map<String, String> loginRequest)
    {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null){
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Wrong input!", null));
        }

        ResultMessage result = userService.loginUser(email, password);

        if (result.getSuccess()) {
            Integer userId = userService.getUserIdByEmail(email);
            return ResponseEntity.ok(new LoginResponse(true, result.getMessage(), userId));
        } else {
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, result.getMessage(), null));
        }
    }
}

