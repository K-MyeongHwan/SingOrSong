package com.singorsong.singorsong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    @Setter
    private int replayCount;

    @Column(name="songDate")
    private Date songDate;

    @Column(name="registeredDate")
    private LocalDate registeredDate;

    @ManyToOne
    @JoinColumn(name="categoryNum")
    private Category category;

    @ManyToOne
    @JoinColumn(name="singerNum")
    private Singer singer;

    @Column(name="songImageUrl")
    @Setter
    private String songImageUrl;

    @Column(name="songImageOriName")
    @Setter
    private String songImageOriName;

    @Column(name="songSoundUrl")
    @Setter
    private String songSoundUrl;

    @Column(name="songSoundOriName")
    @Setter
    private String songSoundOriName;

    @OneToMany(mappedBy = "song")
    @JsonIgnore
    private List<Record> recordList = new ArrayList<>();

    @Transient
    @Setter
    private int recordCount;

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
