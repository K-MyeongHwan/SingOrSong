package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.service.FileService;
import com.singorsong.singorsong.service.SongService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/song")
public class SongController {
    private final SongService songService;
    private final FileService fileService;

    public SongController(SongService songService, FileService fileService) {
        this.songService = songService;
        this.fileService = fileService;
    }

    @GetMapping("/{songNum}")
    public Song getSongBySongNum(@PathVariable("songNum") Long songNum) {
        Song result = songService.findSongBySongNum(songNum.intValue());

        if(result.getSongNum() > 0) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @ResponseBody
    @PostMapping("/audio")
    public LinkedHashMap getAudio() throws Exception{
        //위에 스트링으로 만들어준 객체를 답변을 위한 해쉬맵 객체에 넣어
        //프론트로 보내기 위해 적재
        return fileService.playAudio();
    }

    @GetMapping("/play/{songNum}")
    public void updateSongReplayCount(@PathVariable("songNum") Long songNum) {
        try {
            songService.updateReplayCount(songNum.intValue());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }
}