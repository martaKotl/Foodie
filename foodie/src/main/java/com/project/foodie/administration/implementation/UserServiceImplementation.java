package com.project.foodie.administration.implementation;

import com.project.foodie.administration.EmailService;
import com.project.foodie.administration.ResultMessage;
import com.project.foodie.administration.UserService;
import com.project.foodie.database.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.Objects;
import org.mindrot.jbcrypt.BCrypt;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final DailyGoalRepository goalRepository;
    private final EmailService emailService;

    @Autowired
    public UserServiceImplementation(UserRepository userRepository,
                                     VerificationTokenRepository tokenRepository,
                                     DailyGoalRepository goalRepository,
                                     EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.goalRepository = goalRepository;
        this.emailService = emailService;
    }


    @Transactional
    @Override
    public User createUser(final User user) {
        final UserEntity userEntity = userToUserEntity(user);
        final UserEntity savedUserEntity = userRepository.save(userEntity);

        DailyGoalEntity goal = new DailyGoalEntity();
        goal.setUserId(savedUserEntity.getId());
        goalRepository.save(goal);

        return userEntityToUser(savedUserEntity);
    }


    @Override
    public ResultMessage registerUser(User user) {
        String message;
        if (user.getEmail() != null && userRepository.findByEmail(user.getEmail()).isPresent()) {
            message = "User with email " + user.getEmail() + " already exists";
            return new ResultMessage(message, false);
        }
        else if(user.getUsername() != null && userRepository.findByUsername(user.getUsername()).isPresent()){
            message = "User with username " + user.getUsername() + " already exists";
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
            user.setIsActive(false);
            user.setRegistrationDate(new Date());

            String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(hashedPassword);

            createUser(user);

            UserEntity createdUserEntity = userRepository.findByEmail(user.getEmail()).orElseThrow();

            String token = UUID.randomUUID().toString();
            VerificationTokenEntity verificationToken = VerificationTokenEntity.builder()
                    .token(token)
                    .user(createdUserEntity)
                    .expiryDate(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)) // Token jest ważny 24h
                    .build();
            tokenRepository.save(verificationToken);




            emailService.sendVerificationEmail(user.getEmail(), token);

            message = "Your account has been created: please check " +
                    "your email and click the activation link to be able to use your account.";

            return new ResultMessage(message, true);
        }
    }
    @Override
    public ResultMessage loginUser(String email, String plainPassword) {
        return userRepository.findByEmail(email)
                .map(userEntity -> {
                    if (BCrypt.checkpw(plainPassword, userEntity.getPassword())) {
                        if (!userEntity.getIsActive()) {
                            return new ResultMessage("Account is not activated.", false);
                        }
                        return new ResultMessage("Login successful.", true);
                    } else {
                        return new ResultMessage("Incorrect password.", false);
                    }
                })
                .orElse(new ResultMessage("User with email \"" +email+ "\" not found", false));

    }

    @Override
    public boolean updateSoundSetting(Integer userId, boolean enabled) {
        Optional<UserEntity> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) return false;

        UserEntity user = optionalUser.get();

        Boolean currentSetting = user.getSoundEnabled() != null ? user.getSoundEnabled() : false;
        if (!Objects.equals(currentSetting, enabled)) {
            user.setSoundEnabled(enabled);
            userRepository.save(user);
        }
        return true;
    }

    public Integer getUserIdByEmail(String email) {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        return user.map(UserEntity::getId).orElse(null);
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
