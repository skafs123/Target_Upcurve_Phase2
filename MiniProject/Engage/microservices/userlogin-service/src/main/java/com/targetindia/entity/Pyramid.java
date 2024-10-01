package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Pyramid")
public class Pyramid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PyramidID")
    private Integer pyramidId;

    @Column(name = "PyramidName")
    private String name;

}

