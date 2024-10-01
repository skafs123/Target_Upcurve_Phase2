package com.targetindia.service;

import com.targetindia.dto.DetailedUserDTO;
import com.targetindia.dto.UserDTO;
import com.targetindia.entity.DetailedUser;
import com.targetindia.entity.Team;
import com.targetindia.repository.DetailedUserRepository;
import com.targetindia.util.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class DetailedUserService {
    @Autowired
    private DetailedUserRepository repo;


    public DetailedUserDTO getDetailedUser(Integer id) throws IOException {
        DetailedUser resUser = repo.findById(id).orElse(null);

        if (resUser != null) {
            return DetailedUserDTO.toDetailedUserDTO(resUser, 1, "Success");
        }
        else {
            return DetailedUserDTO.toDetailedUserDTO(null, 0, "Failed to fetch the User");
        }

    }

    public DetailedUserDTO updatePicture(DetailedUserDTO user)  throws IOException {
        DetailedUser resUser = repo.findById(user.getId()).orElse(null);

        if (resUser != null) {
           resUser.setProfilePic(ImageUtil.compressImage(user.getProfilePic().getBytes("ASCII")));
           repo.save(resUser);
           return DetailedUserDTO.toDetailedUserDTO(resUser, 1, "Success");
        }
        else {
            return DetailedUserDTO.toDetailedUserDTO(null, 0, "Failed to fetch the User");
        }

    }

    public void updatePointsForRecognizees(List<Long> recognizeeIds, int points) {
        for (Long recognizeeId : recognizeeIds) {
            repo.updatePoints(recognizeeId, points);
        }
    }

}
