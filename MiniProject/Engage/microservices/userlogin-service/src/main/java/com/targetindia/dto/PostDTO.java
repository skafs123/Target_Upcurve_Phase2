package com.targetindia.dto;

import com.targetindia.entity.*;
import com.targetindia.util.ImageUtil;
import lombok.Data;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class PostDTO {
    private Integer postId;
    private PartialUserDTO recognizer;
    private String postType;
    private String postString;
    private LocalDateTime postDate;
    private CoreValue coreValue;
    private AwardsRecognition awardValue;
    private String postPicture;
    private List<PartialUserDTO> recognizees = new ArrayList<>();
    private List<Behaviour> existingBehaviours = new ArrayList<>();
    private List<Behaviour> newBehaviours = new ArrayList<>();

    public static Post toPost(PostDTO pDTO) {
        try {
            if (pDTO == null) {
                throw new RuntimeException("PostDTO cannot be null");
            }

            Post post = new Post();
            post.setPostId(pDTO.getPostId());
            post.setRecognizer(PartialUserDTO.toPartialUser(pDTO.getRecognizer()));
            post.setPostType(pDTO.getPostType());
            post.setPostString(pDTO.getPostString());
            post.setPostDate(pDTO.getPostDate());
            post.setCoreValue(pDTO.getCoreValue());

            // Handle null value for awardValueID
            if (pDTO.getAwardValue() != null) {
                post.setAwardValue(pDTO.getAwardValue());
            }

            if (pDTO.getPostPicture() != null) {
                post.setPostPicture(ImageUtil.compressImage(pDTO.getPostPicture().getBytes("ASCII")));
            }

            return post;
        } catch (IOException e) {
            throw new RuntimeException("Error processing the image", e);
        }
    }

    public static List<Recognizee> toRecognizees(PostDTO pDTO) throws IOException {
        List<Recognizee> listRecogs = new ArrayList<>();
        for (PartialUserDTO puDTO : pDTO.getRecognizees()) {
            Recognizee recog = new Recognizee();
            recog.setUser(PartialUserDTO.toPartialUser(puDTO));
            listRecogs.add(recog);
        }
        return listRecogs;
    }

    public static PostDTO toPostDTO(Post post) {
        try {
            if (post == null) {
                throw new RuntimeException("Post cannot be null");
            }

            PostDTO pDTO = new PostDTO();
            pDTO.setPostId(post.getPostId());
            pDTO.setRecognizer(PartialUserDTO.toPartialUserDTO(post.getRecognizer()));
            pDTO.setPostType(post.getPostType());
            pDTO.setPostString(post.getPostString());
            pDTO.setPostDate(post.getPostDate());
            pDTO.setCoreValue(post.getCoreValue());

            // Handle null value for awardValueID
            if (post.getAwardValue() != null) {
                pDTO.setAwardValue(post.getAwardValue());
            }

            if (post.getPostPicture() != null) {
                String postPic = new String(ImageUtil.decompressImage(post.getPostPicture()), "ASCII");
                pDTO.setPostPicture(postPic);
            }
            if (post.getRecognizees() != null){
                for (Recognizee recog : post.getRecognizees()) {
                    pDTO.getRecognizees().add(PartialUserDTO.toPartialUserDTO(recog.getUser()));
                }
            }
            if (post.getArBehaviours() != null){
                for (ARBehaviours arBehaviour : post.getArBehaviours()) {
                    pDTO.getExistingBehaviours().add(arBehaviour.getBehaviour());
                }
            }


            return pDTO;
        } catch (IOException e) {
            throw new RuntimeException("Error processing the image", e);
        }
    }

    public static void addRecognizees(PostDTO pDTO, List<Recognizee> recognizeeList) throws IOException {
        for (Recognizee recog : recognizeeList) {
            pDTO.getRecognizees().add(PartialUserDTO.toPartialUserDTO(recog.getUser()));
        }
    }


    public static List<ARBehaviours> toARBehaviours(PostDTO pDTO) {
        List<ARBehaviours> listARBehaviours = new ArrayList<>();
        for (Behaviour behaviour : pDTO.getExistingBehaviours()) {
            ARBehaviours arB = new ARBehaviours();
            arB.setBehaviour(behaviour);
            listARBehaviours.add(arB);
        }
        return listARBehaviours;
    }

    public static void addARBehaviours(PostDTO pDTO, List<ARBehaviours> arBehavioursList){
        for (ARBehaviours arB : arBehavioursList) {
               pDTO.getExistingBehaviours().add(arB.getBehaviour());
        }
    }
}
