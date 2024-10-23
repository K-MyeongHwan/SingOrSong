package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.LikeRecord;
import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Record;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeRecordService {

    private final LikeRecordRepository likeRecordRepository;
    private final RecordRepository recordRepository;
    private final UserRepository userRepository;

    public LikeRecordService(LikeRecordRepository likeRecordRepository, RecordRepository recordRepository,  UserRepository userRepository) {
        this.likeRecordRepository = likeRecordRepository;
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    public LikeRecord findByUserIdAndRecordId(int userId, int recordId) {
        return likeRecordRepository.findByUserUserIdAndRecordRecordId(userId, recordId);
    }

    public void insertLikeRecord(int userId, int recordId) {
        Record record = recordRepository.findByRecordId(recordId);
        User user = userRepository.findUserByUserId(userId);

        LikeRecord likeRecord = LikeRecord.builder()
                .user(user)
                .record(record)
                .isChecked(true)
                .build();
        likeRecordRepository.save(likeRecord);
    }

    public void deleteLikeSong(int userId, int recordId) {
        LikeRecord likeRecord = likeRecordRepository.findByUserUserIdAndRecordRecordId(userId, recordId);
        likeRecordRepository.delete(likeRecord);
    }
}
