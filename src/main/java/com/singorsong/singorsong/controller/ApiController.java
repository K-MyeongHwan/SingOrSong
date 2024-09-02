package com.singorsong.singorsong.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.singorsong.singorsong.service.ApiService;
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

    @GetMapping("/kakao/{code}")
    public String kakaoAccessToken(@PathVariable("code") String code) {
        System.out.println(code);
        try {
            String result = apiService.getAccessToken(code);
            System.out.println(code);
            System.out.println(result);
            return result;
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }

        return "";
    }
}
