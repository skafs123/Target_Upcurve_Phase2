package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;

import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Data
@Entity
@Table(name="Posts")
@NoArgsConstructor

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "postid")
    private Integer postId;
    //join column here

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RecognizerID", referencedColumnName = "UserID")
    private PartialUser recognizer;


    @Column(name = "PostType")
    private String postType;

    @Column(name="PostString")
    private String postString;

    @Column(name="PostDate")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime postDate;

    // Mapping to CoreValue entity
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CoreValueID", referencedColumnName = "CoreValueID")
    private CoreValue coreValue;

    // Mapping to AwardsRecognition entity
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "AwardValueID", referencedColumnName = "AR_ID")
    private AwardsRecognition awardValue;

    @Lob
    @Column(name = "PostPicture")
    private byte[] postPicture;


    @OneToMany(mappedBy="postId",fetch = FetchType.LAZY)
    private List<Recognizee> recognizees ;

    @OneToMany(mappedBy="postId",fetch = FetchType.LAZY)
    private List<ARBehaviours> arBehaviours ;


}