package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {
    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    //songListAll
    public List<Song> findSongAll() { return songRepository.findAll(); }

    //songListByCategoryNum
    public List<Song> findSongByCategoryNum(int categoryNum) {
        Category category = new Category();
        category.setCategoryNum(categoryNum);
        return songRepository.findByCategory(category);
    }
}
