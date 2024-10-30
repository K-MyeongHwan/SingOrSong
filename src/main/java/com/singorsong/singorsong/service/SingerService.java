package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Singer;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.repository.SingerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SingerService {

    private final SingerRepository singerRepository;

    public SingerService(SingerRepository singerRepository) {
        this.singerRepository = singerRepository;
    }

    public Singer findSingerBySingerName(String singerName) {
        return singerRepository.findSingerBySingerName(singerName);
    }

    public Singer findSingerBySingerNum(int singerNum   ) {
        return singerRepository.findSingerBySingerNum(singerNum);
    }

    public void updateSinger(Singer singer) {
        singerRepository.save(singer);
    }

    public List<Singer> findBySingerNameContaining(String singerName) {
        return singerRepository.findBySingerNameContains(singerName);
    }
}
