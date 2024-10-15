package com.singorsong.singorsong.entity;

/*
    id INT(100) NOT NULL PRIMARY KEY ,
    isChecked Boolean default false,
    songNum INT(30),
    userId INT(30)
 */

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity(name="LikeSong")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LikeSong {
    @Id
    @Column(name="likeId")
    @GeneratedValue
    private int likeId;

    @Column(name="isChecked")
    private boolean isChecked;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="songNum")
    @ToString.Exclude
    private Song song;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="userId")
    @ToString.Exclude
    private User user;

    @Builder
    public LikeSong(Boolean isChecked, Song song, User user) {
        this.isChecked = isChecked;
        this.song = song;
        this.user = user;
    }
}
