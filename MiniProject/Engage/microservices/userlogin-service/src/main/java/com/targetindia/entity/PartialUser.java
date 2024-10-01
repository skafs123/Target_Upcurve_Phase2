package com.targetindia.entity;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name="Users")
@JacksonXmlRootElement(localName = "user")
public class PartialUser {
    @Id
    @GeneratedValue(generator = "increment")
    @Column(name="UserID")
    private Integer id;

    @Column(name="Name")
    private String name;

    @Column(name="RoleName")
    private String roleName;

    @Column(name="TeamID")
    private Integer teamId;

    @Lob
    @Column(name = "ProfilePicture", columnDefinition="BLOB")
    private byte[] profilePic ;


}