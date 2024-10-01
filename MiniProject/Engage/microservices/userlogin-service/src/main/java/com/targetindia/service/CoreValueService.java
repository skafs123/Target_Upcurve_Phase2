package com.targetindia.service;

import com.targetindia.entity.CoreValue;
import com.targetindia.repository.CoreValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoreValueService {
    @Autowired
    private CoreValueRepository coreValueRepository;


    public List<CoreValue> getAllCoreValues() {
        return coreValueRepository.findAll();
    }
}
