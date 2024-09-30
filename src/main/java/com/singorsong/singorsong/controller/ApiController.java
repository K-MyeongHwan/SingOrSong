package com.singorsong.singorsong.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.singorsong.singorsong.entity.CustomUserDetail;
import com.singorsong.singorsong.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Scanner;

@RestController
@RequestMapping("/api/oauth/")
public class ApiController {

    @GetMapping("/sosLogin")
    public String login() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getPrincipal());
        return authentication.getPrincipal().toString();
    }

    @GetMapping("/socialLogin")
    public OAuth2User socialLogin(@AuthenticationPrincipal OAuth2User oauth2User) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("****************************************");
        System.out.println(oauth2User);
        System.out.println(authentication.getAuthorities());
        System.out.println("****************************************");

        return oauth2User;
    }

    @GetMapping("/sosLogout")
    public String logout() {
        return "";
    }
}
