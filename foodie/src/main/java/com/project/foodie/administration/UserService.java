package com.project.foodie.administration;

import com.project.foodie.database.User;

public interface UserService {

    User createUser(User user);
    ResultMessage registerUser(User user);
    ResultMessage loginUser(String email, String plainPassword);
    Integer getUserIdByEmail(String email);
    boolean updateSoundSetting(Integer userId, boolean enabled);

}
