package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.*;
import com.singorsong.singorsong.service.FanOfSingerService;
import com.singorsong.singorsong.service.S3Service;
import com.singorsong.singorsong.service.SingerService;
import com.singorsong.singorsong.service.SongService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/singer")
public class SingerController {

    private final SingerService singerService;
    private final SongService songService;
    private final FanOfSingerService fanOfSingerService;
    private final S3Service s3Service;


    public SingerController(SingerService singerService, SongService songService, FanOfSingerService fanOfSingerService, S3Service s3Service) {
        this.singerService = singerService;
        this.songService = songService;
        this.fanOfSingerService = fanOfSingerService;
        this.s3Service = s3Service;
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

    ///api/singer/update/singerImg/${singer.singerNum}
    @PostMapping("/update/singerImg/{singerNum}")
    public String updateSingerImg(@RequestParam(value = "singerImage") MultipartFile songImage, @PathVariable("singerNum") Long singerNum) {
        String singerImageUrl = "";
        try {
            Singer singer = singerService.findSingerBySingerNum(singerNum.intValue());
            String singerImageOriName = "";

            List<String> result = s3Service.uploadFile(songImage, "singerImage/");
            singerImageOriName = result.get(0);
            singerImageUrl = result.get(1);

            System.out.println(singerImageUrl);

            singer.setSingerImageOriName(singerImageOriName);
            singer.setSingerImageUrl(singerImageUrl);
            singerService.updateSinger(singer);
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }
        return singerImageUrl;
    }

    @PostMapping("/contain/{singerName}")
    public List<Singer> getBySingerNameContains(@PathVariable("singerName") String singerName) {
        return singerService.findBySingerNameContaining(singerName);
    }
}
