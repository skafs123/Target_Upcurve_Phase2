package com.targetindia.dto;

import com.targetindia.entity.DetailedUser;
import com.targetindia.util.ImageUtil;
import lombok.Data;

import java.io.IOException;


@Data
public class DetailedUserDTO {
    private Integer id;
    private String email;
    private String name;
    private String roleName;
    private Integer level;
    private Integer teamId;
    private String teamName;
    private Integer pyramidId;
    private Integer pointsReceived;
    private Integer pointsToGive;
    private Integer noOfBSAwards;
    private String profilePic;

    private Double totalPoints;

    private Integer status;
    private String message;


    /*public static User toUser(UserDTO dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setId(dto.id);
        user.setEmail(dto.email);

        return user;
    }*/

    public static DetailedUserDTO toDetailedUserDTO(DetailedUser user, Integer status, String sMsg) throws IOException {
        if (user == null) {
            DetailedUserDTO dto = new DetailedUserDTO();
            dto.setStatus(status);
            dto.setMessage(sMsg);
            return dto;
        }
        DetailedUserDTO dto = new DetailedUserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRoleName(user.getRoleName());
        dto.setLevel(user.getLevel());
        dto.setPointsReceived(user.getPointsReceived());
        dto.setPointsToGive(user.getPointsToGive());
        dto.setNoOfBSAwards(user.getNoOfBSAwards());

        dto.setTeamId(user.getTeam().getId());
        dto.setTeamName(user.getTeam().getName());

        if (user.getTeam() != null) {
            dto.setTeamId(user.getTeam().getId());
            dto.setTeamName(user.getTeam().getName());

            if (user.getTeam().getPyramidID() != null) {
                dto.setPyramidId(user.getTeam().getPyramidID().getPyramidId());
            }
        }

        //need to set profilePic
        if(user.getProfilePic() != null)
        {
            String profPic = new String(ImageUtil.decompressImage(user.getProfilePic()), "ASCII");
            dto.setProfilePic(profPic);
        }
        dto.setStatus(status);
        dto.setMessage(sMsg);
        return dto;


    }
}
