package com.targetindia.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name="Users")
@JacksonXmlRootElement(localName = "detaileduser")
public class DetailedUser {
    @Id
    @GeneratedValue(generator = "increment")
    @Column(name="UserID")
    private Integer id;

    @Column(name="Name")
    private String name;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true,name="Email")
    private String email;

    @Column(name="RoleName")
    private String roleName;

    @Column(name="Level")
    private Integer level;

    @Column(name="PointsReceived")
    private Integer pointsReceived;

    @Column(name="PointsToGive")
    private Integer pointsToGive;

    //This is allocated only for managers and above
    @Column(name="BrightSpark_Awards")
    private Integer noOfBSAwards;

    @ManyToOne // fetch type is EAGER for many-to-one
    @JoinColumn(name = "TeamID")
    private Team team;

    @Lob
    @Column(name = "ProfilePicture", columnDefinition="BLOB")
    private byte[] profilePic ;

    @Transient
    private Integer totalPoints;

}