package com.targetindia.service;

import com.targetindia.dto.PartialUserDTO;
import com.targetindia.entity.PartialUser;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.repository.PartialUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartialUserService {
    @Autowired
    private PartialUserRepository repo;

    public List<PartialUserDTO> getPartialUsers(Integer id) {
        try {
            return repo.findByTeamId(id).stream().map(PartialUserDTO::toPartialUserDTO).collect(Collectors.toList());
        }
        catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }
}