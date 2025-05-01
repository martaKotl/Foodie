package com.project.foodie.administration.implementation;

import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import com.project.foodie.database.User;
import com.project.foodie.database.UserEntity;
import com.project.foodie.database.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImplementation(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    @Override
    public User createUser(final User user) {
        final UserEntity userEntity = userToUserEntity(user);
        final UserEntity savedUserEntity = userRepository.save(userEntity);
        return userEntityToUser(savedUserEntity);
    }


    @Override
    public ResultMessage registerUser(User user) {
        String message;
        if(userRepository.existsById(user.getId())) {
            message = "User with id " + user.getId() + " already exists";
            return new ResultMessage(message, false);
        }
        else if(user.getPassword().length() < 8){
            message = "Password must be at least 8 characters long";
            return new ResultMessage(message, false);
        }
        else if(!Pattern.compile("\\d").matcher(user.getPassword()).find()){
            message = "Password must contain at least one digit";
            return new ResultMessage(message, false);
        }
        else if(!Pattern.compile("[a-zA-Z]").matcher(user.getPassword()).find()){
            message = "Password must contain at least one letter";
            return new ResultMessage(message, false);
        }
        else if(!Pattern.compile("[^a-zA-Z0-9]").matcher(user.getPassword()).find()){
            message = "Password must contain at least one special character";
            return new ResultMessage(message, false);
        }
        else {
            createUser(user);
            message = "Your account has been created: please check " +
                    "your email and click the activation link to be able to use your account.";
            return new ResultMessage(message, true);
        }
    }

    private UserEntity userToUserEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .password(user.getPassword())
                .isActive(user.getIsActive())
                .registrationDate(user.getRegistrationDate())
                .activationDate(user.getActivationDate())
                .build();
    }

    private User userEntityToUser(UserEntity userEntity) {
        return User.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .username(userEntity.getUsername())
                .password(userEntity.getPassword())
                .isActive(userEntity.getIsActive())
                .registrationDate(userEntity.getRegistrationDate())
                .activationDate(userEntity.getActivationDate())
                .build();
    }
}
