package com.singorsong.singorsong.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name="Category")
@Getter
@ToString
@NoArgsConstructor
public class Category {
    @Id
    @Column(name="categoryNum")
    @GeneratedValue
    @Setter
    private int categoryNum;

    @Column(name="categoryName")
    private String categoryName;

    @Builder
    public Category(int categoryNum, String categoryName) {
        this.categoryNum = categoryNum;
        this.categoryName = categoryName;
    }
}
