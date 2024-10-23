package com.singorsong.singorsong.entity;

/*
    likeRecordId INT(100) NOT NULL PRIMARY KEY,
    isChecked Boolean default false,
    recordId   INT(30),
    userId    INT(30),
    FOREIGN KEY(recordId) references Record(recordId),
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
    @JoinColumn(name="recordId")
    @ToString.Exclude
    private Record record;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name="userId")
    @ToString.Exclude
    private User user;

    @Builder
    public LikeRecord(Boolean isChecked, Record record, User user) {
        this.isChecked = isChecked;
        this.record = record;
        this.user = user;
    }
}
