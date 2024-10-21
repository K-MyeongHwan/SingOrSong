package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity(name="Singer")
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Singer {
    @Id
    @Column(name="singerNum")
    @GeneratedValue
    private int singerNum;

    @Column(name="singerName")
    private String singerName;

    @Column(name="debutDate")
    private Date debutDate;

    @ManyToOne
    @JoinColumn(name="categoryNum")
    private Category category;

    @Column(name="singerImageUrl")
    @Setter
    private String singerImageUrl;

    @Column(name="singerImageOriName")
    @Setter
    private String singerImageOriName;

    @Builder
    public Singer(int singerNum, String singerName) {
        this.singerNum = singerNum;
        this.singerName = singerName;
    }
}
