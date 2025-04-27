package com.project.foodie.database;

import com.project.foodie.administration.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/users/{id}")      //w bazie danych id jest serizal i możliwe, że nie potrzebujemy id
    // jak nie bd działać to spróbować zmienić na /users i usunąć @PathVariable final int id
    public ResponseEntity<User> createUser(@PathVariable final int id, @RequestBody final User user) {
        user.setId(id);      //jak nie db działać to to też usunąć
        final User savedUser = userService.createUser(user);
        return new ResponseEntity<User>(savedUser, HttpStatus.CREATED);
    }
}
