package com.project.foodie.database;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
@Getter @Setter
public class UserEntity {
    @Id
    private int id;
    private String email;
    private String username;
    private String password;
    private Boolean isActive;
    private Date registrationDate;
    private Date activationDate;
}
