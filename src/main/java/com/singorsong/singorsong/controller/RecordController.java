package com.singorsong.singorsong.controller;

import com.singorsong.singorsong.entity.Record;
import com.singorsong.singorsong.entity.Singer;
import com.singorsong.singorsong.repository.RecordRepository;
import com.singorsong.singorsong.service.RecordService;
import com.singorsong.singorsong.service.S3Service;
import com.singorsong.singorsong.service.SongService;
import com.singorsong.singorsong.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/record")
public class RecordController {

    private final S3Service s3Service;
    private final RecordService recordService;
    private final SongService songService;
    private final UserService userService;
    private final RecordRepository recordRepository;

    public RecordController(S3Service s3Service, RecordService recordService, SongService songService, UserService userService, RecordRepository recordRepository) {
        this.s3Service = s3Service;
        this.recordService = recordService;
        this.songService = songService;
        this.userService = userService;
        this.recordRepository = recordRepository;
    }


    @PutMapping("/insert/{songNum}")
    @Secured("ROLE_USER")
    public int insertRecord(@PathVariable("songNum") int songNum, HttpServletRequest request) {
        HttpSession session = request.getSession();
        int userId = (Integer) session.getAttribute("loginUser");

        Record record = Record.builder().
                song(songService.findSongBySongNum(songNum)).
                user(userService.getUserByUserId(userId)).
                build();

        System.out.println(record);

        return recordService.insertRecord(record);
    }

    @PostMapping("/update/sound/{recordId}")
    @Secured("ROLE_USER")
    public String updateRecordSound(@RequestParam(value = "recordSound") MultipartFile recordSound, @PathVariable("recordId") int recordId, HttpServletRequest request) {
        String recordSoundUrl = "";
        HttpSession session = request.getSession();
        System.out.println(recordSound);
        try {
            Record record = recordService.findByRecordId(recordId);
            String recordSoundOriName = "";

            List<String> result = s3Service.uploadFile(recordSound, "recordSound/");
            recordSoundOriName = result.get(0);
            recordSoundUrl = result.get(1);
            System.out.println(recordSoundOriName);

            record.setRecordSoundOriName(recordSoundOriName);
            record.setRecordSoundUrl(recordSoundUrl);

            System.out.println(record);

            recordService.updateRecord(record);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return recordSoundUrl;
    }

    @PostMapping("/update")
    @Secured("ROLE_USER")
    public void updateRecord(@RequestBody Record record) {
        recordService.updateRecord(record);
    }

    @GetMapping("/{userId}")
    public List<Record> getRecordByUserId(@PathVariable("userId") int userId) {
        return recordService.findByUserId(userId);
    }
}
