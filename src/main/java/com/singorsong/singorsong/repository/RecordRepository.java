package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.LikeSong;
import com.singorsong.singorsong.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Integer> {
    public Record findByRecordId(int recordId);

    public List<Record> findByUserUserId(int userId);
}
