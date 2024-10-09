package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.*;
import com.singorsong.singorsong.repository.PlatformRepository;
import com.singorsong.singorsong.repository.RoleRepository;
import com.singorsong.singorsong.repository.SongRepository;
import com.singorsong.singorsong.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PlatformRepository platformRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder bCryptPasswordEncoder, PlatformRepository platformRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.platformRepository = platformRepository;
    }

    public List<User> getUserByNickName(String nickName) {
        return userRepository.findUserByNickName(nickName);
    }

    public User getUserByEmail(String userEmail) {
        return userRepository.findUserByUserEmail(userEmail);
    }

    public void insertUser(User user) {
        user.setRole(roleRepository.findRoleByRoleId(1));
        user.setPlatform(platformRepository.findByPlatName("SoS"));
        if(!(user.getUserPassword()==null)) {
            user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        }

        userRepository.save(user);
    }

    public void updateUser(User updateUser) {
        User user = userRepository.findUserByUserId(updateUser.getUserId());
        user.setUserEmail(updateUser.getUserEmail());
        user.setUserGender(updateUser.getUserGender());
        user.setNickName(updateUser.getNickName());
        user.setUserBirth(updateUser.getUserBirth());
        user.setUserIntroduce(updateUser.getUserIntroduce());

        System.out.println(user.toString());

        userRepository.save(user);
    }

    public void userDeleteByUserId(int userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getUserByUserName(String userName) {
        return userRepository.findUserByUserName(userName);
    }

    public User getUserByUserId(int userId) {
        return userRepository.findUserByUserId(userId);
    }
}
