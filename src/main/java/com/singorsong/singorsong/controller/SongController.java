package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.service.FileService;
import com.singorsong.singorsong.service.LikeSongService;
import com.singorsong.singorsong.service.S3Service;
import com.singorsong.singorsong.service.SongService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/song")
public class SongController {
    private final SongService songService;
    private final LikeSongService likeSongService;
    private final FileService fileService;
    private final S3Service s3Service;

    public SongController(SongService songService, FileService fileService, S3Service s3Service, LikeSongService likeSongService) {
        this.songService = songService;
        this.fileService = fileService;
        this.s3Service = s3Service;
        this.likeSongService = likeSongService;
    }

    @GetMapping("/{songNum}")
    public Song getSongBySongNum(@PathVariable("songNum") Long songNum) {
        Song result = songService.findSongBySongNum(songNum.intValue());

        if (result.getSongNum() > 0) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/search/{songName}")
    public List<Song> getSongBySongName(@PathVariable("songName") String songName) {
        List<Song> result = songService.findSongBySongName(songName);

        if (!result.isEmpty()) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @PostMapping("/play/{songNum}")
    public void updateSongReplayCount(@PathVariable("songNum") Long songNum) {
        try {
            songService.updateReplayCount(songNum.intValue());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @PutMapping("/update")
    public void updateSong(@RequestBody Song song) {
        try {
            songService.updateSong(song);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/update/songImg/{songNum}")
    public String updateSongImg(@RequestParam(value = "songImage") MultipartFile songImage, @PathVariable("songNum") Long songNum) {
        String songImageUrl = "";
        try {
            Song song = songService.findSongBySongNum(songNum.intValue());
            String songImgOriName = "";

            List<String> result = s3Service.uploadFile(songImage, "songImage/");
            songImgOriName = result.get(0);
            songImageUrl = result.get(1);

            System.out.println(songImageUrl);

            song.setSongImageOriName(songImgOriName);
            song.setSongImageUrl(songImageUrl);
            songService.updateSong(song);
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }
        return songImageUrl;
    }

    @PostMapping("/update/songSound/{songNum}")
    public String updateSongSound(@RequestParam(value = "songSound") MultipartFile songSound, @PathVariable("songNum") Long songNum) {
        String songSoundUrl = "";
        try {
            Song song = songService.findSongBySongNum(songNum.intValue());
            String songSoundOriName = "";

            List<String> result = s3Service.uploadFile(songSound, "songSound/");
            songSoundOriName = result.get(0);
            songSoundUrl = result.get(1);

            System.out.println(songSoundUrl);

            song.setSongSoundOriName(songSoundOriName);
            song.setSongSoundUrl(songSoundUrl);
            songService.updateSong(song);
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }
        return songSoundUrl;
    }

    @PostMapping("/like/insert/{songNum}")
    @Secured("ROLE_USER")
    public void insertLikeSong(@PathVariable("songNum") int songNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        likeSongService.insertLikeSong(userId, songNum);
    }

    @PostMapping("/like/delete/{songNum}")
    @Secured("ROLE_USER")
    public void deleteLikeSong(@PathVariable("songNum") int songNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        likeSongService.deleteLikeSong(userId, songNum);
    }

    @PostMapping("/like/{songNum}")
    @Secured("ROLE_USER")
    public LikeSong getLikeSong(@PathVariable("songNum") int songNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("loginUser") == null) {
            return null;
        }

        int userId = (Integer) session.getAttribute("loginUser");


        return likeSongService.findByUserIdAndSongNum(userId, songNum);
    }

    @GetMapping("/like/{songNum}")
    public Integer getLikeSongLength(@PathVariable("songNum") int songNum) {
        return likeSongService.findBySongNum(songNum).size();
    }
}