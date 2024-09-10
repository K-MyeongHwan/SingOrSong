package com.singorsong.singorsong.entity;

import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@ToString
public class CustomUserDetail implements UserDetails {
    @Getter
    private int userId;

    private final String userName;
    private final String userPassword;
    private String userEmail;

    @Getter
    private Collection<GrantedAuthority> authorities;

    private User user;

    public CustomUserDetail(int userId, String userName, String userPassword, String userEmail, String role) {
        this.userId = userId;
        this.userName = userName;
        this.authorities = createAuthorities(role);
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }

    //권한 생성
    public Collection<GrantedAuthority> createAuthorities(String role) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    @Override
    public String getPassword() {
        return userPassword;
    }

    @Override
    public String getUsername() {
        return userName;
    }

}
