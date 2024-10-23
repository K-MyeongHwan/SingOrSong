package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.LikeRecord;
import com.singorsong.singorsong.entity.LikeSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRecordRepository extends JpaRepository<LikeRecord, Integer> {

    public LikeRecord findByUserUserIdAndRecordRecordId(int userId, int recordId);
}
