package com.targetindia.controller;


import com.targetindia.dto.PostDTO;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.targetindia.entity.Post;

@RestController
@RequestMapping("/posts")
@Validated
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/post")
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO pDTO)  {
        try {
            PostDTO createdPostDTO = postService.savePost(pDTO);
            return new ResponseEntity<>(createdPostDTO, HttpStatus.CREATED);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
    @GetMapping("/all")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        try {
            List<PostDTO> posts = postService.getAllPosts();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
    @GetMapping("/byTeam/{teamId}")
    public ResponseEntity<List<PostDTO>> getPostsByTeam(@PathVariable Integer teamId) {
        try {
            List<PostDTO> posts = postService.getPostsByRecognizerTeam(teamId);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
    @GetMapping("/byType/{postType}")
    public ResponseEntity<List<PostDTO>> getPostsByType(@PathVariable String postType) {
        try {
            List<PostDTO> posts = postService.getPostsByType(postType);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
    @GetMapping("/pyramid/{teamID}")
    public ResponseEntity<List<PostDTO>> getPostsByUserPyramid(@PathVariable Integer teamID) {
        try {
            List<PostDTO> posts = postService.getPostsByUserPyramid(teamID);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostDTO>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Page<PostDTO> posts = postService.getPosts(page, size);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

}
