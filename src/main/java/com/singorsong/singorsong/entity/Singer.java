package com.singorsong.singorsong.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name="Singer")
@Getter
@ToString
@NoArgsConstructor
public class Singer {
    @Id
    @Column(name="singerNum")
    @GeneratedValue
    private int singerNum;

    @Column(name="singerName")
    private String singerName;

    @Builder
    public Singer(int singerNum, String singerName) {
        this.singerNum = singerNum;
        this.singerName = singerName;
    }
}
