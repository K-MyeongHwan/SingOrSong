package com.singorsong.singorsong.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {
    @GetMapping("/")
    public String getTest1(){
        return "test";
    }

    @GetMapping("/test")
    public String getTest2(){
        return "test";
    }
}