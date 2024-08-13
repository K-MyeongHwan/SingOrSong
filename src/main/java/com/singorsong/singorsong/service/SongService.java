package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.repository.SongRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.List;
import java.util.Optional;

@Service
public class SongService {
    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    //songListAll
    public List<Song> findSongAll() {
        return songRepository.findAll();
    }

    //songListByCategoryNum
    public List<Song> findSongByCategoryNum(int categoryNum) {
        Category category = new Category();
        category.setCategoryNum(categoryNum);
        return songRepository.findByCategory(category);
    }

    //songBySongNum
    public Song findSongBySongNum(int songNum) {
        return songRepository.findBySongNum(songNum);
    }

    //updateReplayCount
    @Transactional
    public void updateReplayCount(int songNum) {
        Song song = songRepository.findBySongNum(songNum);
        song.setReplayCount(1 + song.getReplayCount());
        songRepository.save(song);
    }
}
