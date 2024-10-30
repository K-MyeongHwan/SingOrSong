package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Record;
import com.singorsong.singorsong.entity.Singer;
import com.singorsong.singorsong.repository.RecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordService {

    private final RecordRepository recordRepository;

    public RecordService(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    public Record findByRecordId(int recordId) {
        return recordRepository.findByRecordId(recordId);
    }

    public int insertRecord(Record record) {
        return recordRepository.save(record).getRecordId();
    }

    public void updateRecord(Record record) {
        recordRepository.save(record);
    }

    public List<Record> findByUserId(int userId) {
        return recordRepository.findByUserUserId(userId);
    }

    public List<Record> findByIsPublic(boolean isPublic) {
        return recordRepository.findByIsPublic(isPublic);
    }

    public void updateLikeRecordCount(int recordId, boolean isLike) {
        Record record = recordRepository.findByRecordId(recordId);

        if (isLike) {
            record.setLikeRecordCount(record.getLikeRecordCount() + 1);
        } else {
            record.setLikeRecordCount(record.getLikeRecordCount() - 1);
        }

        recordRepository.save(record);
    }

    public List<Record> findByUserIdAndIsPublic(int userId, boolean isPublic) {
        return recordRepository.findByUserUserIdAndIsPublic(userId, isPublic);
    }
}
