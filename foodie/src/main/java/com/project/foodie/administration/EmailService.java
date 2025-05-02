package com.project.foodie.administration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Account Activation";
        String url = "http://localhost:3000/verify?token=" + token;
        String content = "Click the following link to activate your account:\n" + url +
                "\n Link is active for 24 hours.\nIf you have any problems please contact administrator of this aplication.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);
    }
}
