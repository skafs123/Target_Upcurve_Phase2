package com.targetindia.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;


@NoArgsConstructor
@Getter
public class ARBehavioursPK implements Serializable {
    private Integer postId;
    private Integer behaviour;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ARBehavioursPK arBehavioursPK)) return false;
        return Objects.equals(behaviour, arBehavioursPK.behaviour) && Objects.equals(postId, arBehavioursPK.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(behaviour, postId);
    }
}