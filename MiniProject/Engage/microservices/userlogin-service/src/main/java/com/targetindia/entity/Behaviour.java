package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Entity
@NoArgsConstructor

@Table(name = "Behaviours")
public class Behaviour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BehaviourID")
    private Integer behaviourID;

    @Column(name = "BehaviorName")
    private String behaviourName;

    @Column(name = "UserID")
    private Integer userID;

  }
