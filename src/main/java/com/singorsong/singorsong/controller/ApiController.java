package com.singorsong.singorsong.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.singorsong.singorsong.service.ApiService;
import com.singorsong.singorsong.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/oauth/")
public class ApiController {
    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @PostMapping("/kakao")
    public String getKakaoEnv() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(apiService.findKakaoEnv());
        } catch (Exception e) {
            System.out.print(e.getMessage());
        }

        return "";
    }

    @PostMapping("/kakao/{code}")
    public String getKakaoId(@PathVariable("code") String code) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String result = apiService.getAccessToken(code, "kakao");
            System.out.println(result);

            return mapper.writeValueAsString(apiService.getUserInfo(result, "kakao"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return "";
    }

    @PostMapping("/google")
    public String getGoogleEnv() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(apiService.findGoogleEnv());
        } catch (Exception e) {
            System.out.print(e.getMessage());
        }

        return "";
    }

    @PostMapping("/google/code")
    public String getGoogleId(@RequestParam(value = "code") String code) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String result = apiService.getAccessToken(code, "google");
            System.out.println(result);

            return mapper.writeValueAsString(apiService.getUserInfo(result, "google"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return "";
    }

    @PostMapping("/naver")
    public String getNaverEnv() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(apiService.findNaverEnv());
        } catch (Exception e) {
            System.out.print(e.getMessage());
        }

        return "";
    }

    @PostMapping("/naver/{code}")
    public String getNaverId(@PathVariable("code") String code) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            String result = apiService.getAccessToken(code, "naver");
            System.out.println(result);

            return mapper.writeValueAsString(apiService.getUserInfo(result, "naver"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return "";
    }
}
