package com.targetindia.dto;

import com.targetindia.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {

    private LocalDateTime postDate;
    private String recOrGiv;
    private String postType;
    private int points;
    private String recognizerName;
    private String coreValue;
    private List<String> behaviours;
    private String postString;

    public static DashboardDTO fromPost(Post post, String recOrGiv) {
        return new DashboardDTO(
                post.getPostDate(),
                recOrGiv,
                Objects.equals(post.getPostType(), "Recognition") ? "Shout out" : post.getAwardValue().getAr(),
                post.getAwardValue() != null ? post.getAwardValue().getPoints() : 0,
                post.getRecognizer().getName(),
                post.getCoreValue().getCoreValue(),
                post.getArBehaviours().stream()
                        .map(behaviour -> behaviour.getBehaviour().getBehaviourName())
                        .collect(Collectors.toList()),
                post.getPostString()
        );
    }
}
