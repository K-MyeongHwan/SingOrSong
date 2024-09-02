package com.singorsong.singorsong.repository;

import com.singorsong.singorsong.entity.Role;
import com.singorsong.singorsong.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    public Role findRoleByRoleId(Integer roleId);
}
