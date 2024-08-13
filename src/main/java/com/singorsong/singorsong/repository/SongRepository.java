package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Integer> {
    public List<Song> findByCategory(Category category);

    public Song findBySongNum(Integer songNum);
}
