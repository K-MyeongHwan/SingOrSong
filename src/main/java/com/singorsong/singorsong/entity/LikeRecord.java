package com.singorsong.singorsong.entity;

/*
    likeRecordId INT(100) NOT NULL PRIMARY KEY,
    isChecked Boolean default false,
    songNum   INT(30),
    userId    INT(30),
    FOREIGN KEY(songNum) references Song(songNum),
    FOREIGN KEY(userId) references User(userId)
 */

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity(name="LikeRecord")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LikeRecord {
    @Id
    @Column(name="likeRecordId")
    @GeneratedValue
    private int likeRecordId;

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
    public LikeRecord(Boolean isChecked, Song song, User user) {
        this.isChecked = isChecked;
        this.song = song;
        this.user = user;
    }
}
