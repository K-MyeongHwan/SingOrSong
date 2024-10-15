package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.LikeSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeSongRepository extends JpaRepository<LikeSong, Integer> {

    public LikeSong findByUserUserIdAndSongSongNum(int userId, int songNum);

    public List<LikeSong> findBySongSongNum(int songNum);
}
