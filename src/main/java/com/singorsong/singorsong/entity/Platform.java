package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name="Platform")
@Getter
@ToString
@NoArgsConstructor
public class Platform {
    @Id
    @Column(name="platId")
    @GeneratedValue
    @Setter
    private int platId;

    @Column(name="platName")
    private String platName;

    @OneToMany(mappedBy="platform")
    private List<User> userList = new ArrayList<User>();

    @Builder
    public Platform(int platId, String platName) {
        this.platId = platId;
        this.platName = platName;
    }
}
