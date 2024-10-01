package com.targetindia.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name="Teams")
@JacksonXmlRootElement(localName = "team")
public class Team {
    @Id
    @GeneratedValue(generator = "increment")
    @Column(name="TeamID")
    private Integer id;

    @Column(name="TeamName")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pyramidID")
    private Pyramid pyramidID;

    @Column(name = "OTs")
    private Integer ots;

    @Column(name = "ABs")
    private Integer abs;

}