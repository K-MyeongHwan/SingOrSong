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
}
