package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@Entity
@Table(name = "AwardsRecognitions")
@NoArgsConstructor
public class AwardsRecognition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="AR_ID")
    private Integer arID;

    @Column(name="AR")
    private String ar;

    @Column(name="Points")
    private Integer points;

}