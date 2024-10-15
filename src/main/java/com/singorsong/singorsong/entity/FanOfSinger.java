package com.singorsong.singorsong.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity(name="FanOfSinger")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FanOfSinger {
    @Id
    @Column(name="fanNum")
    @GeneratedValue
    private int fanNum;

    @Column(name="isChecked")
    private boolean isChecked;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="singerNum")
    @ToString.Exclude
    private Singer singer;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="userId")
    @ToString.Exclude
    private User user;

    @Builder
    public FanOfSinger(Boolean isChecked, Singer singer, User user) {
        this.isChecked = isChecked;
        this.singer = singer;
        this.user = user;
    }
}
