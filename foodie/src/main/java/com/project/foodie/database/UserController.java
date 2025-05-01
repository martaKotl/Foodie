package com.project.foodie.database;

import com.project.foodie.configuration.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final AuthenticationService authService;

    @Autowired
    public UserController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthenticationResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

}
