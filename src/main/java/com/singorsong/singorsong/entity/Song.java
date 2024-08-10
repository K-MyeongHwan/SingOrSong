package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Entity(name="Song")
@Getter
@ToString
@NoArgsConstructor
public class Song {
    @Id
    @Column(name="songNum")
    @GeneratedValue
    private int songNum;

    @Column(name="songName")
    private String songName;

    @Column(name="replayCount")
    private int replayCount;

    @Column(name="songDate")
    private Date songDate;

    @ManyToOne
    @JoinColumn(name="categoryNum")
    private Category category;

    @ManyToOne
    @JoinColumn(name="singerNum")
    private Singer singer;

    @Builder
    public Song(int songNum, String songName, int replayCount, Date songDate, Category category, Singer singer) {
        this.songNum = songNum;
        this.songName = songName;
        this.replayCount = replayCount;
        this.songDate = songDate;
        this.category = category;
        this.singer = singer;
    }
}
