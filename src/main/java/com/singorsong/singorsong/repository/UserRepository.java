package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.entity.Song;
import com.singorsong.singorsong.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    public List<User> findUserByNickName(String nickName);

    public List<User> findUserByUserEmail(String userEmail);

}
