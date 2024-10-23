package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Singer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SingerRepository extends JpaRepository<Singer, Integer> {
    public Singer findSingerBySingerName(String singerName);

    public Singer findSingerBySingerNum(int singerNum);
}