package com.targetindia.repository;

import com.targetindia.entity.DetailedUser;
import com.targetindia.entity.PartialUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PartialUserRepository extends JpaRepository<PartialUser, Integer> {

    List<PartialUser> findByTeamId(Integer teamId);


}