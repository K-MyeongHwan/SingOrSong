package com.singorsong.singorsong.entity;
/*
create table record (
    recordId INT(100) NOT NULL,
    userId INT(30) NOT NULL,
    songNum INT(30) NOT NULL,
    viewCount INT(30),
    recordSoundUrl VARCHAR(1000),
    recordSoundOriName VARCHAR(1000),
    isUpload Boolean,
    PRIMARY KEY(recordId),
    FOREIGN KEY(userId) references User(userId),
    FOREIGN KEY(songNum) references Song(songNum)
)
 */

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity(name="Record")
@Getter
@ToString
@NoArgsConstructor
public class Record {
    @Id
    @Column(name="recordId")
    @GeneratedValue
    private int recordId;

    @Column(name="viewCount")
    @Setter
    private Integer viewCount;

    @Column(name="likeRecordCount")
    @Setter
    private Integer likeRecordCount;

    @Column(name="recordSoundUrl")
    @Setter
    private String recordSoundUrl;

    @Column(name="recordSoundOriName")
    @Setter
    private String recordSoundOriName;

    @Column(name="isPublic")
    @Setter
    private Boolean isPublic;

    @Column(name="recordDate")
    @Setter
    private Date recordDate;

    @ManyToOne
    @Setter
    @JoinColumn(name="songNum")
    @ToString.Exclude
    private Song song;

    @ManyToOne
    @Setter
    @JoinColumn(name="userId")
    @ToString.Exclude
    private User user;

    @Builder
    public Record(Song song, User user, Date recordDate) {
        this.song = song;
        this.user = user;
        this.recordDate = recordDate;
    }
}
