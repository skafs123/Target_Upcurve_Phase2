package com.targetindia.service;

import com.targetindia.dto.DashboardDTO;
import com.targetindia.dto.PostDTO;
import com.targetindia.entity.*;
import com.targetindia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RecognizeeRepository recognizeeRepository;

    @Autowired
    private PartialUserRepository partialUserRepository;

    @Autowired
    private DetailedUserRepository detailedUserRepository;

    @Autowired
    private CoreValueRepository coreValueRepository;

    @Autowired
    private AwardsRecognitionRepository awardsRecognitionRepository;

    @Autowired
    private ARBehavioursRepository arBehavioursRepository;

    @Autowired
    private BehaviourRepository behaviourRepository;

    public PostDTO savePost(PostDTO pDTO) throws IOException {
        if (pDTO == null || pDTO.getRecognizer() == null) {
            throw new IllegalArgumentException("PostDTO or Recognizer cannot be null");
        }
        // Convert DTO to Post entity
        Post post = PostDTO.toPost(pDTO);

        // Fetch and set the recognizer (PartialUser) from the database
        PartialUser recognizer = partialUserRepository.findById(pDTO.getRecognizer().getId())
                .orElseThrow(() -> new RuntimeException("Recognizer not found"));
        post.setRecognizer(recognizer);

        // Fetching CoreValue by ID
        if (pDTO.getCoreValue() != null) {
            CoreValue coreValue = coreValueRepository.findById(pDTO.getCoreValue().getCoreValueID())
                    .orElseThrow(() -> new RuntimeException("Core Value not found"));
            post.setCoreValue(coreValue);
        }

        // Fetching AwardsRecognition by ID
        if (pDTO.getAwardValue() != null) {
            AwardsRecognition awardsRecognition = awardsRecognitionRepository.findById(pDTO.getAwardValue().getArID())
                    .orElseThrow(() -> new RuntimeException("Awards Recognition not found"));
            post.setAwardValue(awardsRecognition);
        }

        // Save the Post entity
        post = postRepository.save(post);

        // Handle Recognizees
        List<Recognizee> listRecogs = PostDTO.toRecognizees(pDTO);
        for (Recognizee recog : listRecogs) {
            recog.setPostId(post.getPostId());
            recognizeeRepository.save(recog);
        }
        if (pDTO.getAwardValue() != null && pDTO.getAwardValue().getArID() != null) {
            updatePointsForRecognizees(listRecogs, pDTO.getAwardValue().getArID(), pDTO.getRecognizer().getId());
        }


        //handling behaviours
        // 1: add new behaviours into the behaviours table
        // 2: add the behaviours to the ARBehaviours table

        List<Behaviour> newBehaviours = pDTO.getNewBehaviours();
        if (newBehaviours != null){
            for(Behaviour behaviour: newBehaviours){
                Behaviour tempBehaviour = behaviourRepository.save(behaviour);
                ARBehaviours arB = new ARBehaviours();
                arB.setBehaviour(tempBehaviour);
                arB.setPostId(post.getPostId());
                arBehavioursRepository.save(arB);
            }
        }


        List<ARBehaviours> listARBehaviours = PostDTO.toARBehaviours(pDTO);
        for (ARBehaviours arB : listARBehaviours) {
            arB.setPostId(post.getPostId());
            arBehavioursRepository.save(arB);
        }

        // Retrieve and return the saved Post entity as a DTO
        List<Recognizee> recognizeeList = recognizeeRepository.findByPostId(post.getPostId());
        List<ARBehaviours> arBehavioursList = arBehavioursRepository.findByPostId(post.getPostId());
        PostDTO retDTO = PostDTO.toPostDTO(post);


        if (recognizeeList != null ) {
            PostDTO.addRecognizees(retDTO, recognizeeList);
        }
        if (arBehavioursList != null ) {
            PostDTO.addARBehaviours(retDTO, arBehavioursList);//implement
        }

        return retDTO;
    }
    private void updatePointsForRecognizees(List<Recognizee> recognizees, int awardValueID, int recognizerID ) {
        int pointsToAdd = 0;
        int pointsToSubtract = 0;

        switch (awardValueID) {
            case 1:
                pointsToAdd = 500;
                break;
            case 2:
                pointsToAdd = 1000;
                break;
            case 3:
                pointsToAdd = 1000;
                break;
            case 4:
                pointsToAdd = 20;
                pointsToSubtract = 20 * recognizees.size();
                break;
            default:
                throw new IllegalArgumentException("Invalid awardValueID");
        }
        DetailedUser detailedUser1 = detailedUserRepository.findById(recognizerID)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (awardValueID == 4 && detailedUser1.getPointsToGive()>=pointsToSubtract) {
            detailedUser1.setPointsToGive(detailedUser1.getPointsToGive() - pointsToSubtract);
        }
        detailedUserRepository.save(detailedUser1);
        for (Recognizee recognizee : recognizees) {
            DetailedUser detailedUser = detailedUserRepository.findById(recognizee.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (awardValueID == 4)
            {
                if(detailedUser1.getPointsToGive()>=pointsToSubtract) {
                    detailedUser.setPointsToGive(detailedUser.getPointsReceived() + pointsToAdd);
                }
            }
            else {
                detailedUser.setPointsReceived(detailedUser.getPointsReceived() + pointsToAdd);
            }
            detailedUserRepository.save(detailedUser);

        }

    }
    public List<PostDTO> getAllPosts() throws IOException {
        List<Post> posts = postRepository.findAll();
        List<PostDTO> postDTOs = new ArrayList<>();

        for (int i = posts.size() - 1; i >= 0; i--) {
            Post post = posts.get(i);
            PostDTO postDTO = PostDTO.toPostDTO(post);
            /**
             * added in PostDTO.toPostDTO()
             * List<Recognizee> recognizees = recognizeeRepository.findByPostId(post.getPostId());
             * PostDTO.addRecognizees(postDTO, recognizees);
             */
            // added in PostDTO.toPostDTO()
            // List<Recognizee> recognizees = recognizeeRepository.findByPostId(post.getPostId());
            // PostDTO.addRecognizees(postDTO, recognizees);

            postDTOs.add(postDTO);
        }

        return postDTOs;
    }
    public List<PostDTO> getPostsByType(String postType) throws IOException {
        List<Post> posts = postRepository.findByPostType(postType);
        List<PostDTO> postDTOs = new ArrayList<>();

        for (Post post : posts) {
            PostDTO postDTO = PostDTO.toPostDTO(post);
            /**
             * added in PostDTO.toPostDTO()
             * List<Recognizee> recognizees = recognizeeRepository.findByPostId(post.getPostId());
             * PostDTO.addRecognizees(postDTO, recognizees);
             */
            postDTOs.add(postDTO);
        }
        return postDTOs;
    }

    public Page<PostDTO> getPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAllByOrderByPostDateDesc(pageable);
        return postPage.map(PostDTO::toPostDTO);
    }

    public List<PostDTO> getPostsByRecognizerTeam(Integer teamId) {
        List<PartialUser> usersInTeam = partialUserRepository.findByTeamId(teamId);
        List<Post> posts = postRepository.findByRecognizerIn(usersInTeam);

        List<PostDTO> postDTOs = new ArrayList<>();
        for (Post post : posts) {
            PostDTO postDTO = PostDTO.toPostDTO(post);
            postDTOs.add(postDTO);
        }

        postDTOs.sort(Comparator.comparing(PostDTO::getPostDate).reversed());

        return postDTOs;
    }

    public List<PostDTO> getPostsByUserPyramid(Integer TeamID) {
        List<Post> posts = postRepository.findPostsByTeamPyramid(TeamID);

        List<PostDTO> postDTOs = new ArrayList<>();
        for (Post post : posts) {
            PostDTO postDTO = PostDTO.toPostDTO(post);
            postDTOs.add(postDTO);
        }
        postDTOs.sort(Comparator.comparing(PostDTO::getPostDate).reversed());

        return postDTOs;
    }
    public int getCountShoutoutsGivenThisMonth(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        return postRepository.countShoutoutsGivenBetweenDates(recognizerID, startDate, endDate);
    }

    public int getPointsShoutoutsGivenThisMonth(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        Integer points = postRepository.pointsShoutoutsGivenBetweenDates(recognizerID, startDate, endDate);
        return points != null ? points : 0;
    }

    public int getCountShoutoutsReceivedThisMonth(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        return postRepository.countShoutoutsReceivedBetweenDates(recognizeeID, startDate, endDate);
    }

    public int getPointsShoutoutsReceivedThisMonth(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        Integer points = postRepository.pointsShoutoutsReceivedBetweenDates(recognizeeID, startDate, endDate);
        return points != null ? points : 0;
    }

    public int getCountAwardsReceivedThisMonth(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        return postRepository.countAwardsReceivedBetweenDates(recognizeeID, startDate, endDate);
    }

    public int getPointsAwardsReceivedThisMonth(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        Integer points = postRepository.pointsAwardsReceivedBetweenDates(recognizerID, startDate, endDate);
        return points != null ? points : 0;
    }
    public int getCountShoutoutsGivenThisYear(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        return postRepository.countShoutoutsGivenBetweenDates(recognizerID, startDate, endDate);
    }
    public int getPointsShoutoutsGivenThisYear(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        Integer points = postRepository.pointsShoutoutsGivenBetweenDates(recognizerID, startDate, endDate);
        return points != null ? points : 0;
    }
    public int getCountShoutoutsReceivedThisYear(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        return postRepository.countShoutoutsReceivedBetweenDates(recognizeeID, startDate, endDate);
    }
    public int getPointsShoutoutsReceivedThisYear(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        Integer points = postRepository.pointsShoutoutsReceivedBetweenDates(recognizeeID, startDate, endDate);
        return points != null ? points : 0;
    }

    public int getCountAwardsReceivedThisYear(Integer recognizeeID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        return postRepository.countAwardsReceivedBetweenDates(recognizeeID, startDate, endDate);
    }

    public int getPointsAwardsReceivedThisYear(Integer recognizerID) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        Integer points = postRepository.pointsAwardsReceivedBetweenDates(recognizerID, startDate, endDate);
        return points != null ? points : 0;
    }
    public List<DashboardDTO> getPostsByRecognizerIdYear(Integer recognizerId) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        List<Post> posts = postRepository.findByRecognizerIdBetweenDates(recognizerId,startDate,endDate);
        return posts.stream()
                .map(post -> DashboardDTO.fromPost(post, "Given"))
                .collect(Collectors.toList());
    }

    public List<DashboardDTO> getPostsByRecognizeeIdYear(Integer recognizeeId) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfYear(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfYear()).with(LocalTime.MAX);

        List<Post> posts = postRepository.findByRecognizeesIdBetweenDates(recognizeeId,startDate,endDate);
        return posts.stream()
                .map(post -> DashboardDTO.fromPost(post, "Received"))
                .collect(Collectors.toList());
    }
    public List<DashboardDTO> getPostsByRecognizerIdMonth(Integer recognizerId) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        List<Post> posts = postRepository.findByRecognizerIdBetweenDates(recognizerId, startDate, endDate);
        return posts.stream()
                .map(post -> DashboardDTO.fromPost(post, "Given"))
                .collect(Collectors.toList());
    }

    public List<DashboardDTO> getPostsByRecognizeeIdMonth(Integer recognizeeId) {
        LocalDateTime startDate = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

        List<Post> posts = postRepository.findByRecognizeesIdBetweenDates(recognizeeId, startDate, endDate);
        return posts.stream()
                .map(post -> DashboardDTO.fromPost(post, "Received"))
                .collect(Collectors.toList());
    }
}