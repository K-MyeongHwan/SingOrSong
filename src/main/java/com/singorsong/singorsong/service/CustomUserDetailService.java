package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.CustomUserDetail;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        User user = userRepository.findUserByUserEmail(userEmail);

        System.out.println("*********************************");
        System.out.println("isLoadUserByUsername");
        System.out.println(user.toString());
        System.out.println("*********************************");

        if(user.getUserId() == 0) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        return new CustomUserDetail(user);
    }
}
