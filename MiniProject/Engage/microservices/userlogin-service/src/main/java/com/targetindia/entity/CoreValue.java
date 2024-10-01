package com.targetindia.entity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "CoreValues")
@NoArgsConstructor
public class CoreValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="CoreValueID")
    private Integer coreValueID;

    @Column(name="CoreValue")
    private String coreValue;

}
