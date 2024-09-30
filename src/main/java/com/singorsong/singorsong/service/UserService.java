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
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder bCryptPasswordEncoder, PlatformRepository platformRepository, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.platformRepository = platformRepository;
        this.authenticationManager = authenticationManager;
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

    public List<User> getUserByUserName(String userName) {
        return userRepository.findUserByUserName(userName);
    }

    public User getUserByUserId(int userId) {
        return userRepository.findUserByUserId(userId);
    }

    public UserDetails login(String userEmail, String userPassword) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userEmail, userPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();

        return userDetail;
    }
}
