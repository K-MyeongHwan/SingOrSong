package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.CustomUserDetail;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.service.ApiService;
import com.singorsong.singorsong.service.CategoryService;
import com.singorsong.singorsong.service.SongService;
import com.singorsong.singorsong.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Boolean login(@RequestParam(value = "userEmail") String userEmail, @RequestParam(value = "userPassword") String userPassword, HttpServletRequest request) {
        try {
            CustomUserDetail user = (CustomUserDetail) userService.login(userEmail, userPassword);

            request.getSession().invalidate();
            HttpSession session = request.getSession(true);
            session.setAttribute("loginUser", user.getUserId());
            session.setMaxInactiveInterval(60 * 30);

            System.out.println("****************************************");
            System.out.println(user.toString());
            System.out.println(session.getAttribute("loginUser"));
            System.out.println(user.getAuthorities());
            System.out.println("****************************************");

            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    @GetMapping("/register/checkNick/{nickName}")
    public Boolean nickNameCheckDuplicates(@PathVariable("nickName") String nickName) {
        if (userService.getUserByNickName(nickName).isEmpty()) {
            return true;
        } else if (!userService.getUserByNickName(nickName).isEmpty()) {
            return false;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/register/checkEmail/{userEmail}")
    public Boolean emailCheckDuplicates(@PathVariable("userEmail") String userEmail) {
        if (userService.getUserByEmail(userEmail) == null) {
            return true;
        } else if (userService.getUserByEmail(userEmail) != null) {
            return false;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @PostMapping("/register/new/{platName}")
    public void registerNewUser(@RequestBody User user, @PathVariable("platName") String platName) {
        try {
            userService.insertUser(user, platName);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @GetMapping("/checkName/{userName}")
    public Boolean findUserByUserName(@PathVariable("userName") String userName) {
        if (userService.getUserByUserName(userName).isEmpty()) {
            return true;
        } else if (!userService.getUserByUserName(userName).isEmpty()) {
            return false;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }
}