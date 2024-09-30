package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.PlatformRepository;
import com.singorsong.singorsong.repository.RoleRepository;
import com.singorsong.singorsong.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOauth2UserService extends DefaultOAuth2UserService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final PlatformRepository platformRepository;
    private final RoleRepository roleRepository;


    //UserDetailsService,loadUserByUsername == OAuth2UserService.loadUser
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        System.out.println("*********************************");
        System.out.println("isLoadUser");
        System.out.println(oauth2User.toString());
        System.out.println(oauth2User.getAttributes());
        System.out.println(userRequest.getClientRegistration().getRegistrationId());
        System.out.println("*********************************");

        //회원가입 기록이 없다
        if(userRepository.findUserByUserEmail(oauth2User.getAttribute("email"))==null) {
            System.out.println("첫 로그인");

            saveUser(oauth2User, userRequest.getClientRegistration().getRegistrationId());
        } else {
            System.out.println("로그인 경험자");
        }

        return oauth2User;
    }

    public void saveUser(OAuth2User oauth2User, String registrationId) {
        User user = null;

        if(registrationId.equals("google")) {
            user = User.builder()
                    .userName(oauth2User.getAttribute("name"))
                    .userPassword(bCryptPasswordEncoder.encode(oauth2User.getAttribute("sub")))
                    .userEmail(oauth2User.getAttribute("email"))
                    .nickName(registrationId + "_" + oauth2User.getAttribute("sub"))
                    .build();
            user.setRole(roleRepository.findRoleByRoleId(1));
            user.setPlatform(platformRepository.findByPlatName(registrationId));
        } else if(registrationId.equals("kakao")) {
            Map<String, String> properties = oauth2User.getAttribute("properties");
            Long kakaoId = oauth2User.getAttribute("id");

            user = User.builder()
                    .userName(properties.get("nickname"))
                    .userPassword(bCryptPasswordEncoder.encode(String.valueOf(kakaoId)))
                    .userEmail(oauth2User.getAttribute("email"))
                    .nickName(registrationId + "_" + String.valueOf(kakaoId))
                    .build();
            user.setRole(roleRepository.findRoleByRoleId(1));
            user.setPlatform(platformRepository.findByPlatName(registrationId));

        } else if(registrationId.equals("naver")) {
            Map<String, String> properties = oauth2User.getAttribute("response");

            user = User.builder()
                    .userName(properties.get("name"))
                    .userPassword(bCryptPasswordEncoder.encode(properties.get("id")))
                    .userEmail(properties.get("email"))
                    .nickName(registrationId + "_" + properties.get("id"))
                    .build();
            user.setRole(roleRepository.findRoleByRoleId(1));
            user.setPlatform(platformRepository.findByPlatName(registrationId));
        }

        System.out.println(user.toString());
        userRepository.save(user);
    }
}
