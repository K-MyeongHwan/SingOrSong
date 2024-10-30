package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.CustomUserDetail;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.service.CategoryService;
import com.singorsong.singorsong.service.S3Service;
import com.singorsong.singorsong.service.SongService;
import com.singorsong.singorsong.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final S3Service s3Service;

    public UserController(UserService userService, S3Service s3Service) {
        this.userService = userService;
        this.s3Service = s3Service;
    }

    @PostMapping("/{nickName}")
    public User getUserByNickName(@PathVariable("nickName") String nickName) {
        return userService.getUserByNickName(nickName).get(0);
    }

    @PostMapping("/isLogin")
    public Map<String, String> getIsLogin(HttpServletRequest request) {
        HttpSession session = request.getSession();
        Map<String, String> result = new HashMap<>();
        try {
            System.out.println(session.getAttribute("loginUser"));
            System.out.println(session.getAttribute("loginUserRole"));

            result.put("loginUser", session.getAttribute("loginUser").toString());
            result.put("loginUserRole", session.getAttribute("loginUserRole").toString());
        } catch(NullPointerException e) {
            result = null;
        }

        return result;
    }

    @Secured("ROLE_USER")
    @PostMapping("/loginUser")
    public User getLoginUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        try {
            int userId = (Integer) session.getAttribute("loginUser");
            User user = userService.getUserByUserId(userId);
            System.out.println(user);
            return user;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @PutMapping("/update")
    public void updateUser(@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession();
        try {
            int userId = (Integer) session.getAttribute("loginUser");
            user.setUserId(userId);

            userService.updateUser(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public void deleteUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        try {
            int userId = (Integer) session.getAttribute("loginUser");
            userService.userDeleteByUserId(userId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
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

    @PostMapping("/register/new")
    public void registerNewUser(@RequestBody User user) {
        try {
            userService.insertUser(user);
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

    @PostMapping("/update/profileImg")
    public String updateProfileImg(@RequestParam(value = "profileImage") MultipartFile profileImage, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String profileImgUrl = "";
        try {
            User user = userService.getUserByUserId((Integer)session.getAttribute("loginUser"));
            String profileImgOriName = "";

            List<String> result = s3Service.uploadFile(profileImage, "profileImage/" );
            profileImgOriName = result.get(0);
            profileImgUrl = result.get(1);

            System.out.println(profileImgUrl);

            user.setProfileImageOriName(profileImgOriName);
            user.setProfileImageUrl(profileImgUrl);
            userService.updateUser(user);
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }
        return profileImgUrl;
    }

    @PostMapping("/contain/{nickName}")
    public List<User> getByNickNameContains(@PathVariable("nickName") String nickName) {
        return userService.findByNickNameContaining(nickName);
    }

    @PostMapping("/update/coinCount")
    @Secured("ROLE_USER")
    public void updateUserCoinCount(HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        User user = userService.getUserByUserId(userId);
        user.setCoinCount(user.getCoinCount() - 1);

        userService.updateUser(user);
    }
}