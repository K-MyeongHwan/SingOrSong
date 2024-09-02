package com.singorsong.singorsong.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

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

    @Column(name="roleName")
    private String roleName;

    @Builder
    public Role(int roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }
}
