package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Role;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.RoleRepository;
import com.singorsong.singorsong.repository.SongRepository;
import com.singorsong.singorsong.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<User> getUserByNickName(String nickName) {
        return userRepository.findUserByNickName(nickName);
    }

    public List<User> getUserByEmail(String userEmail) {
        return userRepository.findUserByUserEmail(userEmail);
    }

    public User insertUser(User user) {
        user.setRole(roleRepository.findRoleByRoleId(1));
        user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        return userRepository.save(user);
    }
}
