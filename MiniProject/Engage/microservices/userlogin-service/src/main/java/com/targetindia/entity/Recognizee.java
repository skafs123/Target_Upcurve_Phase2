package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Data
@Entity
@Table(name="Recognizees")
@IdClass( RecognizeePK.class )
@NoArgsConstructor
@Getter
@Setter
public class Recognizee {
    @Id
    @Column (name = "postID")
    private Integer postId;

//    @ManyToOne
//    @JoinColumn(name = "postID", insertable = false, updatable = false)
//    @JoinColumn(name = "postID")
//    private Post post;


//    @Column (name = "userID")
//    private Integer user;

    @Id
    @ManyToOne // fetch type is EAGER for many-to-one
    @JoinColumn(name = "userID")
    private PartialUser user;

}
