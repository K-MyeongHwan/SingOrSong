package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.*;
import com.singorsong.singorsong.repository.FanOfSingerRepository;
import com.singorsong.singorsong.repository.SingerRepository;
import com.singorsong.singorsong.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FanOfSingerService {

    private final FanOfSingerRepository fanOfSingerRepository;
    private final SingerRepository singerRepository;
    private final UserRepository userRepository;

    public FanOfSingerService(FanOfSingerRepository fanOfSingerRepository, SingerRepository singerRepository, UserRepository userRepository) {
        this.fanOfSingerRepository = fanOfSingerRepository;
        this.singerRepository = singerRepository;
        this.userRepository = userRepository;
    }

    public List<FanOfSinger> findBySingerNum(int singerNum) {
        return fanOfSingerRepository.findFanOfSingerBySingerSingerNum(singerNum);
    }

    public FanOfSinger findByUserIdAndSingerNum(int userId, int singerNum) {
        return fanOfSingerRepository.findByUserUserIdAndSingerSingerNum(userId, singerNum);
    }

    public void insertFanOfSinger(int userId, int singerNum) {
        Singer singer = singerRepository.findSingerBySingerNum(singerNum);
        User user = userRepository.findUserByUserId(userId);

        FanOfSinger fan = FanOfSinger.builder()
                .user(user)
                .singer(singer)
                .isChecked(true)
                .build();
        fanOfSingerRepository.save(fan);
    }

    public void deleteFanOfSinger(int userId, int singerNum) {
        FanOfSinger fan = fanOfSingerRepository.findByUserUserIdAndSingerSingerNum(userId, singerNum);
        fanOfSingerRepository.delete(fan);
    }
}
