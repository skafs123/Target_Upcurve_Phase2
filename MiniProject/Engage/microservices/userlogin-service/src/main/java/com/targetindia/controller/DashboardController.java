package com.targetindia.controller;

import com.targetindia.dto.DashboardDTO;
import com.targetindia.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private PostService postService;

    @GetMapping("/shoutouts/given/month/{recognizerID}")
    public ResponseEntity<Map<String, Object>> getShoutoutMetricsGivenThisMonth(@PathVariable("recognizerID") Integer recognizerID) {
        try {
            int count = postService.getCountShoutoutsGivenThisMonth(recognizerID);
            int points = postService.getPointsShoutoutsGivenThisMonth(recognizerID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("/shoutouts/received/month/{recognizeeID}")
    public ResponseEntity<Map<String, Object>> getShoutOutMetricsReceivedThisMonth(@PathVariable("recognizeeID") Integer recognizeeID) {
        try {
            int count = postService.getCountShoutoutsReceivedThisMonth(recognizeeID);
            int points = postService.getPointsShoutoutsReceivedThisMonth(recognizeeID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("/awards/received/month/{recognizeeID}")
    public ResponseEntity<Map<String, Object>> getAwardMetricsReceivedThisMonth(@PathVariable("recognizeeID") Integer recognizeeID) {
        try {
            int count = postService.getCountAwardsReceivedThisMonth(recognizeeID);
            int points = postService.getPointsAwardsReceivedThisMonth(recognizeeID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("/shoutouts/given/year/{recognizerID}")
    public ResponseEntity<Map<String, Object>> getShoutoutMetricsGivenThisYear(@PathVariable("recognizerID") Integer recognizerID) {
        try {
            int count = postService.getCountShoutoutsGivenThisYear(recognizerID);
            int points = postService.getPointsShoutoutsGivenThisYear(recognizerID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("/shoutouts/received/year/{recognizeeID}")
    public ResponseEntity<Map<String, Object>> getShoutOutMetricsReceivedThisYear(@PathVariable("recognizeeID") Integer recognizeeID) {
        try {
            int count = postService.getCountShoutoutsReceivedThisYear(recognizeeID);
            int points = postService.getPointsShoutoutsReceivedThisYear(recognizeeID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("/awards/received/year/{recognizeeID}")
    public ResponseEntity<Map<String, Object>> getAwardMetricsReceivedThisYear(@PathVariable("recognizeeID") Integer recognizeeID) {
        try {
            int count = postService.getCountAwardsReceivedThisYear(recognizeeID);
            int points = postService.getPointsAwardsReceivedThisYear(recognizeeID);

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            response.put("points", points);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }
    @GetMapping("viewall/given/year/{recognizerId}")
    public ResponseEntity<List<DashboardDTO>> getPostsByRecognizerYear(@PathVariable Integer recognizerId) {
        List<DashboardDTO> posts = postService.getPostsByRecognizerIdYear(recognizerId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("viewall/received/year/{recognizeeId}")
    public ResponseEntity<List<DashboardDTO>> getPostsByRecognizeeYear(@PathVariable Integer recognizeeId) {
        List<DashboardDTO> posts = postService.getPostsByRecognizeeIdYear(recognizeeId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    @GetMapping("viewall/given/month/{recognizerId}")
    public ResponseEntity<List<DashboardDTO>> getPostsByRecognizerMonth(@PathVariable Integer recognizerId) {
        List<DashboardDTO> posts = postService.getPostsByRecognizerIdMonth(recognizerId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("viewall/received/month/{recognizeeId}")
    public ResponseEntity<List<DashboardDTO>> getPostsByRecognizeeMonth(@PathVariable Integer recognizeeId) {
        List<DashboardDTO> posts = postService.getPostsByRecognizeeIdMonth(recognizeeId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
}

