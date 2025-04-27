package com.project.foodie.administration;

import com.project.foodie.database.User;

public interface UserService {

    User createUser(User user);

    RegisterMessage registerUser(User user);
}
