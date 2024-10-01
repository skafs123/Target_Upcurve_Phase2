package com.targetindia.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Getter
public class RecognizeePK implements Serializable {
    private Integer postId;
    private Integer user;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RecognizeePK recognizeePK)) return false;
        return Objects.equals(user, recognizeePK.user) && Objects.equals(postId, recognizeePK.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, postId);
    }
}