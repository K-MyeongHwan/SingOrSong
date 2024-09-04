package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.Platform;
import com.singorsong.singorsong.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformRepository extends JpaRepository<Platform, Integer> {
    public Platform findByPlatId(int platId);

    public Platform findByPlatName(String platName);
}
