package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity(name="User")
@Getter
@ToString
@NoArgsConstructor
public class User {
    @Id
    @Column(name="userId")
    @GeneratedValue
    private int userId;

    @Column(name="userName")
    private String userName;

    @Column(name="userEmail")
    @Setter
    private String userEmail;

    @Column(name="nickName")
    private String nickName;

    @Column(name="profileImageUrl")
    private String profileImageUrl;

    @Column(name="userGender")
    private int userGender;

    @OneToOne
    @JoinColumn(name="roleId")
    @Setter
    private Role role;

    @Column(name="userPassword")
    @Setter
    private String userPassword;

    @Column(name="userBirth")
    private Date userBirth;

    @Builder
    public User(int userId, String userName, String userEmail, String nickName, String profileImageUrl, int userGender, Role role, String userPassword, Date userBirth) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.nickName = nickName;
        this.profileImageUrl = profileImageUrl;
        this.userGender = userGender;
        this.role = role;
        this.userPassword = userPassword;
        this.userBirth = userBirth;
    }

}
