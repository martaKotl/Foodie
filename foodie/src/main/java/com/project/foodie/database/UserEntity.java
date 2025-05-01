package com.project.foodie.database;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;

    private String username;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "registration_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date registrationDate;

    @Column(name = "activation_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date activationDate;
}
