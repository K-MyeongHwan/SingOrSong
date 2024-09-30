package com.singorsong.singorsong.entity;

import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@ToString
public class CustomUserDetail implements UserDetails, OAuth2User {
    private int userId;

    private final Collection<GrantedAuthority> authorities;

    private final User user;

    //OAuth2User , accessToken 으로 획득한 사용자 정보 ( JSON )
    private Map<String, Object> attributes;

    public CustomUserDetail(User user) {
        this.user = user;
        this.authorities = createAuthorities(user.getRole().getRoleName());
    }

    public CustomUserDetail(User user, Map<String, Object> attributes) {
        this.user = user;
        this.authorities = createAuthorities(user.getRole().getRoleName());
        this.attributes = attributes;
    }

    //권한 생성
    public Collection<GrantedAuthority> createAuthorities(String role) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    //////////////
    @Override
    public String getPassword() {
        return user.getUserPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserEmail();
    }

    @Override
    public String getName() {
        return user.getUserEmail();
    }

    public int getUserId() {
        return user.getUserId();
    }

}
