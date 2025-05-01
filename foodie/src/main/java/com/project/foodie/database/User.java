package com.project.foodie.database;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private Integer id;

    private String email;

    private String username;

    private String password;

    private Boolean isActive;

    private Date registrationDate;

    private Date activationDate;
}
