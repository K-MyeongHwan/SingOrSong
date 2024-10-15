package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Singer;
import com.singorsong.singorsong.repository.SingerRepository;
import org.springframework.stereotype.Service;

@Service
public class SingerService {

    private final SingerRepository singerRepository;

    public SingerService(SingerRepository singerRepository) {
        this.singerRepository = singerRepository;
    }

    public Singer findSingerBySingerName(String singerName) {
        return singerRepository.findSingerBySingerName(singerName);
    }
}
