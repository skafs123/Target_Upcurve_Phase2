package com.targetindia.service;

import com.targetindia.entity.Behaviour;
import com.targetindia.repository.BehaviourRepository;
import com.targetindia.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BehaviourService {

    @Autowired
    private BehaviourRepository behaviourRepository;
    @Autowired
    private PostRepository postRepository;

    public List<Behaviour> getAllBehavioursByUserID(Integer userID) {
        return behaviourRepository.findByUserIDOrUserIDIsNull(userID);
    }

}

