package com.targetindia.service;

import com.targetindia.dto.DetailedUserDTO;
import com.targetindia.entity.DetailedUser;
import com.targetindia.repository.PointsRepository;
import com.targetindia.util.ImageUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopPerformerService {

    @Autowired
    private PointsRepository pointsRepository;

    @Transactional
    public List<DetailedUserDTO> getUsersByTeamId(Integer teamId) {
        // Fetch total points by criteria
        List<Object[]> resultSet = pointsRepository.findTotalPointsByCriteria();

        // Map results to DetailedUserDTO
        List<DetailedUserDTO> allUsers = resultSet.stream().map(row -> {
            DetailedUserDTO userDTO = new DetailedUserDTO();
            userDTO.setId((Integer) row[0]);
            userDTO.setName((String) row[1]);
            userDTO.setTeamId((Integer) row[2]);

            byte[] profilePicBytes = (byte[]) row[3]; // Use profilePicBytes from the row
            if (profilePicBytes != null) {
                try {
                    // Assuming ImageUtil.decompressImage returns a properly formatted image
                    String profPic = new String(ImageUtil.decompressImage(profilePicBytes), "ASCII");
                    userDTO.setProfilePic(profPic);
                } catch (Exception e) {
                    userDTO.setProfilePic(null);
                }
            } else {
                userDTO.setProfilePic(null);
            }

            userDTO.setPyramidId((Integer) row[4]);
            userDTO.setTotalPoints(((Number) row[5]).doubleValue());
            return userDTO;
        }).collect(Collectors.toList());

        // Filter users by teamId
        List<DetailedUserDTO> filteredUsers = allUsers.stream()
                .filter(user -> user.getTeamId().equals(teamId))
                .collect(Collectors.toList());

        // Return filtered DTO list
        return filteredUsers;
    }

    @Transactional
    public List<DetailedUserDTO> getUsersByPyramidId(Integer pyramidId) {
        // Fetch total points by criteria
        List<Object[]> resultSet = pointsRepository.findTotalPointsByCriteria();

        // Map results to DetailedUserDTO
        List<DetailedUserDTO> allUsers = resultSet.stream().map(row -> {
            DetailedUserDTO userDTO = new DetailedUserDTO();
            userDTO.setId((Integer) row[0]);
            userDTO.setName((String) row[1]);
            userDTO.setTeamId((Integer) row[2]);

            byte[] profilePicBytes = (byte[]) row[3]; // Use profilePicBytes from the row
            if (profilePicBytes != null) {
                try {
                    // Assuming ImageUtil.decompressImage returns a properly formatted image
                    String profPic = new String(ImageUtil.decompressImage(profilePicBytes), "ASCII");
                    userDTO.setProfilePic(profPic);
                } catch (Exception e) {
                    userDTO.setProfilePic(null);
                }
            } else {
                userDTO.setProfilePic(null);
            }

            userDTO.setPyramidId((Integer) row[4]);
            userDTO.setTotalPoints(((Number) row[5]).doubleValue());
            return userDTO;
        }).collect(Collectors.toList());

        // Filter users by pyramidId
        List<DetailedUserDTO> filteredUsers = allUsers.stream()
                .filter(user -> user.getPyramidId().equals(pyramidId))
                .collect(Collectors.toList());

        // Return filtered DTO list
        return filteredUsers;
    }
}
