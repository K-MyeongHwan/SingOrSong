package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.service.CategoryService;
import com.singorsong.singorsong.service.SongService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    private final CategoryService categoryService;
    private final SongService songService;
    public HomeController(CategoryService categoryService, SongService songService) {
        this.categoryService = categoryService;
        this.songService = songService;
    }

    @GetMapping("/categoryList")
    public List<Category> getCategoryList() {
        List<Category> result = categoryService.findCategoryAll();
        System.out.println(result);

        if(!(result.isEmpty())) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/songList")
    public List<Song> getSongList() {
        List<Song> result = songService.findSongAll();
        System.out.println(result);

        if(!(result.isEmpty())) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/songList/{categoryNum}")
    public List<Song> getSongListByCategoryNum(@PathVariable("categoryNum") Long categoryNum) {
        List<Song> result = songService.findSongByCategoryNum(categoryNum.intValue());
        System.out.println(result);

        if(!(result.isEmpty())) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }

    @GetMapping("/song/{songNum}")
    public Song getSongBySongNum(@PathVariable("songNum") Long songNum) {
        Song result = songService.findSongBySongNum(songNum.intValue());

        if(result.getSongNum() > 0) {
            return result;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "entity not found");
        }
    }
}