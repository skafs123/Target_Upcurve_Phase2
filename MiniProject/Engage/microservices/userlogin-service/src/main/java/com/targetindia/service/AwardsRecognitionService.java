package com.targetindia.service;

import com.targetindia.entity.AwardsRecognition;
import com.targetindia.repository.AwardsRecognitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AwardsRecognitionService {

    @Autowired
    private AwardsRecognitionRepository awardsRecognitionRepository;

    public List<AwardsRecognition> getAllAwardsRecognitions() {
        List<AwardsRecognition> awardsList = awardsRecognitionRepository.findAll();
        if (!awardsList.isEmpty()) {
            return awardsList.subList(0, awardsList.size() - 1);
        }
        return awardsList;
    }
}