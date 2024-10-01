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
@JacksonXmlRootElement(localName = "user")
public class User {
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


    //@JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name="Password")
    private String password;



}