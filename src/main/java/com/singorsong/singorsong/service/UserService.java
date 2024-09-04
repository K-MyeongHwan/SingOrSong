package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Role;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.PlatformRepository;
import com.singorsong.singorsong.repository.RoleRepository;
import com.singorsong.singorsong.repository.SongRepository;
import com.singorsong.singorsong.repository.UserRepository;
import jakarta.transaction.Transactional;
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

    public List<User> getUserByEmail(String userEmail) {
        return userRepository.findUserByUserEmail(userEmail);
    }

    public void insertUser(User user, String platName) {
        user.setRole(roleRepository.findRoleByRoleId(1));
        user.setPlatform(platformRepository.findByPlatName(platName));
        if(!(user.getUserPassword()==null)) {
            user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        }

        userRepository.save(user);
    }

    public List<User> getUserByUserName(String userName) {
        return userRepository.findUserByUserName(userName);
    }
}
