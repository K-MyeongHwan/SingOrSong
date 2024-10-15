package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.LikeSongRepository;
import com.singorsong.singorsong.repository.SongRepository;
import com.singorsong.singorsong.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeSongService {

    private final LikeSongRepository likeSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public LikeSongService(LikeSongRepository likeSongRepository, SongRepository songRepository, UserRepository userRepository) {
        this.likeSongRepository = likeSongRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    public LikeSong findByUserIdAndSongNum(int userId, int songNum) {
        return likeSongRepository.findByUserUserIdAndSongSongNum(userId, songNum);
    }

    public void insertLikeSong(int userId, int songNum) {
        Song song = songRepository.findSongBySongNum(songNum);
        User user = userRepository.findUserByUserId(userId);

        LikeSong likeSong = LikeSong.builder()
                .user(user)
                .song(song)
                .isChecked(true)
                .build();
        likeSongRepository.save(likeSong);
    }

    public void deleteLikeSong(int userId, int songNum) {
        LikeSong likeSong = likeSongRepository.findByUserUserIdAndSongSongNum(userId, songNum);
        likeSongRepository.delete(likeSong);
    }

    public List<LikeSong> findBySongNum(int songNum) {
        return likeSongRepository.findBySongSongNum(songNum);
    }
}
