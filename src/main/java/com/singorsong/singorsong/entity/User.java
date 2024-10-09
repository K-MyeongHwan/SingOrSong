package com.singorsong.singorsong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity(name="User")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name="userId")
    @GeneratedValue
    @Setter
    private int userId;

    @Column(name="userName")
    private String userName;

    @Column(name="userEmail")
    @Setter
    private String userEmail;

    @Column(name="nickName")
    @Setter
    private String nickName;

    @Column(name="profileImageUrl")
    @Setter
    private String profileImageUrl;

    @Column(name="userIntroduce")
    @Setter
    private String userIntroduce;

    @Column(name="userGender")
    @Setter
    private int userGender;

    @Column(name="coinCount")
    @Setter
    private int coinCount;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="roleId")
    @Setter
    @Getter
    @ToString.Exclude
    private Role role;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="platId")
    @Setter
    @ToString.Exclude
    private Platform platform;

    @Column(name="userPassword")
    @Setter
    @Getter
    private String userPassword;

    @Column(name="userBirth")
    @Setter
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
