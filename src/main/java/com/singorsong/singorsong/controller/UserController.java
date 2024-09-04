package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.service.ApiService;
import com.singorsong.singorsong.service.CategoryService;
import com.singorsong.singorsong.service.SongService;
import com.singorsong.singorsong.service.UserService;
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

    @GetMapping("/register/checkNick/{nickName}")
    public Boolean nickNameCheckDuplicates(@PathVariable("nickName") String nickName) {
        if(userService.getUserByNickName(nickName).isEmpty()) {
            return true;
        } else if(!userService.getUserByNickName(nickName).isEmpty()) {
            return false;
        }  else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/register/checkEmail/{userEmail}")
    public Boolean emailCheckDuplicates(@PathVariable("userEmail") String userEmail) {
        if(userService.getUserByEmail(userEmail).isEmpty()) {
            return true;
        } else if(!userService.getUserByEmail(userEmail).isEmpty()) {
            return false;
        }  else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @PostMapping("/register/new/{platName}")
    public void registerNewUser(@RequestBody User user, @PathVariable("platName") String platName) {
        try {
            userService.insertUser(user, platName);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @GetMapping("/checkName/{userName}")
    public Boolean findUserByUserName(@PathVariable("userName") String userName) {
        if(userService.getUserByUserName(userName).isEmpty()) {
            return true;
        } else if(!userService.getUserByUserName(userName).isEmpty()) {
            return false;
        }  else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }
}