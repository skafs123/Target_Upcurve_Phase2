package com.targetindia.dto;

import com.targetindia.entity.PartialUser;
import com.targetindia.entity.Post;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.util.ImageUtil;
import lombok.Data;

import java.io.IOException;


@Data
public class PartialUserDTO {
    private Integer id;
    private String name;
    private String roleName;
    private Integer teamId;
    private String profilePic;

    public static PartialUser toPartialUser(PartialUserDTO puDTO) {
        try {
            if (puDTO == null) {
                throw new RuntimeException("PartialUserDTO cannot be null");
            }

            PartialUser puser = new PartialUser();
            puser.setId(puDTO.getId());
            puser.setName(puDTO.getName());
            puser.setRoleName(puDTO.getRoleName());
            puser.setTeamId(puDTO.getTeamId());
            //no need to set profilePic


            return puser;
        } catch (Exception e) {
            throw new RuntimeException("Error", e);
        }
    }
    public static PartialUserDTO toPartialUserDTO(PartialUser puser) {
        try {
            if (puser == null) {
                PartialUserDTO pdto = new PartialUserDTO();

                return pdto;
            }

            PartialUserDTO pudto = new PartialUserDTO();
            pudto.setId(puser.getId());
            pudto.setName(puser.getName());
            pudto.setRoleName(puser.getRoleName());
            pudto.setTeamId(puser.getTeamId());
            //need to set profilePic
            if (puser.getProfilePic() != null) {
                String profPic = new String(ImageUtil.decompressImage(puser.getProfilePic()), "ASCII");
                pudto.setProfilePic(profPic);
            }


            return pudto;
        }
        catch (IOException ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }

    }
}
