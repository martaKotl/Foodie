package com.project.foodie.database;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, VerificationTokenRepository tokenRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
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


    @GetMapping("/activate")
    public ResponseEntity<ResultMessage> activateAccount(@RequestParam String token) {

        Optional<VerificationTokenEntity> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.badRequest().body(new ResultMessage("Invalid token", false));
        }

        VerificationTokenEntity verificationToken = optionalToken.get();

        if (verificationToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body(new ResultMessage("Token expired", false));
        }

        UserEntity user = verificationToken.getUser();

        if (user.getIsActive()) {
            return ResponseEntity.ok(new ResultMessage("Account is already active", true));
        }

        user.setIsActive(true);
        user.setActivationDate(new Date());
        userRepository.save(user);

        return ResponseEntity.ok(new ResultMessage("Account activated successfully!", true));
    }
  
    @PostMapping("/login")
    public ResponseEntity<ResultMessage> login(@RequestBody Map<String, String> loginRequest)
    {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null){
            return ResponseEntity.badRequest().body(new ResultMessage("Wrong input!", false));
        }

        ResultMessage result = userService.loginUser(email, password);

        if (result.getSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

    }
}

