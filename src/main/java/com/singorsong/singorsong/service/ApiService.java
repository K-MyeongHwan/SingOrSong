package com.singorsong.singorsong.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.singorsong.singorsong.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.http.HttpClient;
import java.util.HashMap;
import java.util.Map;

@Service
public class ApiService {

    @Value("${kakao-rest-key}")
    private String kakaoClientId;

    @Value("${kakao-redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao-client-secret}")
    private String kakaoClientSecret;

    @Value("${google-client-id}")
    private String googleClientId;

    @Value("${google-redirect-uri}")
    private String googleRedirectUri;

    @Value("${google-secret-key}")
    private String googleSecretKey;

    @Value("${naver-client-id}")
    private String naverClientId;

    @Value("${naver-redirect-uri}")
    private String naverRedirectUri;

    @Value("${naver-secret-key}")
    private String naverSecretKey;

    public HashMap<String, String> findKakaoEnv() {
        HashMap<String, String> kakaoEnv = new HashMap<>();
        kakaoEnv.put("client_id", kakaoClientId);
        kakaoEnv.put("client_secret", kakaoClientSecret);
        kakaoEnv.put("redirect_uri", kakaoRedirectUri);

        return kakaoEnv;
    }

    public HashMap<String, String> findGoogleEnv() {
        HashMap<String, String> googleEnv = new HashMap<>();
        googleEnv.put("client_id", googleClientId);
        googleEnv.put("redirect_uri", googleRedirectUri);

        return googleEnv;
    }

    public HashMap<String, String> findNaverEnv() {
        HashMap<String, String> naverEnv = new HashMap<>();
        naverEnv.put("client_id", naverClientId);
        naverEnv.put("redirect_uri", naverRedirectUri);

        return naverEnv;
    }


    public String getAccessToken(String code, String type) throws JsonProcessingException {
        String url = "";

        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HTTP Body 생성
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);

        if(type.equals("kakao")) {
            url = "https://kauth.kakao.com/oauth/token";
            body.add("client_id", kakaoClientId);
            body.add("redirect_uri", kakaoRedirectUri);
            body.add("client_secret", kakaoClientSecret);
        } else if(type.equals("google")) {
            url = "https://oauth2.googleapis.com/token";
            body.add("client_id", googleClientId);
            body.add("redirect_uri", googleRedirectUri);
            body.add("client_secret", googleSecretKey);
        } else if(type.equals("naver")) {
            url = "https://nid.naver.com/oauth2.0/token";
            body.add("client_id", naverClientId);
            body.add("redirect_uri", naverRedirectUri);
            body.add("client_secret", naverSecretKey);
        }

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(body, headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                url,
                HttpMethod.POST,
                tokenRequest,
                String.class
        );

        // HTTP 응답 (JSON) -> 액세스 토큰 파싱
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        System.out.println(responseBody);
        return jsonNode.get("access_token").asText();
    }

    public HashMap<String, String> getUserInfo(String accessToken, String type) throws JsonProcessingException {
        String url = "";
        HttpMethod httpMethod = null;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        if(type.equals("kakao")) {
            url = "https://kapi.kakao.com/v2/user/me";
            httpMethod = HttpMethod.POST;
        } else if(type.equals("google")) {
            url = "https://www.googleapis.com/userinfo/v2/me";
            httpMethod = HttpMethod.GET;
        } else if(type.equals("naver")) {
            url = "https://openapi.naver.com/v1/nid/me";
            httpMethod = HttpMethod.POST;
        }

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> userInfoRequest = new HttpEntity<>(headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                url,
                httpMethod,
                userInfoRequest,
                String.class
        );

        String id = "";
        String nickname = "";
        String email = "";

        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        if(type.equals("kakao")) {
            id = jsonNode.get("id").asText();
            nickname = jsonNode.get("properties")
                    .get("nickname").asText();
            email = jsonNode.get("kakao_account")
                    .get("email").asText();
        } else if(type.equals("google")) {
            id = jsonNode.get("id").asText();
            nickname = jsonNode.get("name").asText();
            email = jsonNode.get("email").asText();
        } else if(type.equals("naver")) {
            id = jsonNode.get("response")
                    .get("id").asText();
            nickname = jsonNode.get("response")
                    .get("name").asText();
            email = jsonNode.get("response")
                    .get("email").asText();
        }

        HashMap<String, String> userInfo = new HashMap<>();
        userInfo.put("id", id);
        userInfo.put("nickname", nickname);
        userInfo.put("email", email);

        System.out.println("사용자 정보: " + id + ", " + nickname + ", " + email);
        return userInfo;
    }
}
