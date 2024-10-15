package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.FanOfSinger;
import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Singer;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.service.FanOfSingerService;
import com.singorsong.singorsong.service.SingerService;
import com.singorsong.singorsong.service.SongService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/singer")
public class SingerController {

    private final SingerService singerService;
    private final SongService songService;
    private final FanOfSingerService fanOfSingerService;


    public SingerController(SingerService singerService, SongService songService, FanOfSingerService fanOfSingerService) {
        this.singerService = singerService;
        this.songService = songService;
        this.fanOfSingerService = fanOfSingerService;
    }

    @PostMapping("/{singerName}")
    public Singer getSingerBySingerName(@PathVariable("singerName") String singerName) {
        return singerService.findSingerBySingerName(singerName);
    }

    @PostMapping("/songList/{singerNum}")
    public List<Song> getSongListBySingerName(@PathVariable("singerNum") int singerNum) {
        return songService.findSongBySingerNum(singerNum);
    }

    @PostMapping("/fan/{singerNum}")
    @Secured("ROLE_USER")
    public FanOfSinger getLikeSong(@PathVariable("singerNum") int singerNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("loginUser") == null) {
            return null;
        }

        int userId = (Integer) session.getAttribute("loginUser");

        return fanOfSingerService.findByUserIdAndSingerNum(userId, singerNum);
    }

    @GetMapping("/fan/{singerNum}")
    public Integer getFanOfSingerLength(@PathVariable("singerNum") int singerNum) {
        return fanOfSingerService.findBySingerNum(singerNum).size();
    }

    @PostMapping("/fan/insert/{singerNum}")
    @Secured("ROLE_USER")
    public void insertFanOfSinger(@PathVariable("singerNum") int singerNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        fanOfSingerService.insertFanOfSinger(userId, singerNum);
    }

    @PostMapping("/fan/delete/{singerNum}")
    @Secured("ROLE_USER")
    public void deleteLikeSong(@PathVariable("singerNum") int singerNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        fanOfSingerService.deleteFanOfSinger(userId, singerNum);
    }

}
