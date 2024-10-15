package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.FanOfSinger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FanOfSingerRepository extends JpaRepository<FanOfSinger, Integer> {
    public List<FanOfSinger> findFanOfSingerBySingerSingerNum(int singerNum);

    public FanOfSinger findByUserUserIdAndSingerSingerNum(Integer userId, Integer singerNum);
}
