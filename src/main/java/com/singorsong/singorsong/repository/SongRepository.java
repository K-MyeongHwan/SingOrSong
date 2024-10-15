package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Integer> {
    public List<Song> findByCategory(Category category);

    public Song findSongBySongNum(Integer songNum);

    public List<Song> findSongBySongNameContains(String songName);

    public List<Song> findSongBySingerSingerNum(Integer singerNum);
}
