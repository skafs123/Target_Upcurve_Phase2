package com.targetindia.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Data
@Entity
@Table(name="ARBehaviours")
@IdClass( ARBehavioursPK.class )
@NoArgsConstructor
public class ARBehaviours {
    @Id
    @Column(name = "PostID")
    private Integer postId;


    @Id
    @ManyToOne // fetch type is EAGER for many-to-one
    @JoinColumn(name = "BehaviorID")
    private Behaviour behaviour;

}
