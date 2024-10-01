package com.targetindia.repository;

import com.targetindia.entity.Post;
import com.targetindia.entity.Recognizee;
import com.targetindia.entity.RecognizeePK;
import com.targetindia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecognizeeRepository extends JpaRepository< Recognizee, RecognizeePK> {
    List<Recognizee>findByPostId(Integer id);
}
