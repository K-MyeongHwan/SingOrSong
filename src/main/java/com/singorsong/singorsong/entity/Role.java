package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity(name="Role")
@Getter
@ToString
@NoArgsConstructor
public class Role {
    @Id
    @Column(name="roleId")
    @GeneratedValue
    @Setter
    private int roleId;

    @Getter
    @Column(name="roleName")
    private String roleName;

    @OneToMany(mappedBy="role")
    private List<User> userList = new ArrayList<User>();

    @Builder
    public Role(int roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }
}
