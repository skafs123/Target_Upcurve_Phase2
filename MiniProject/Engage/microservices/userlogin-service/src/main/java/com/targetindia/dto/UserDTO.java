package com.targetindia.dto;


import com.targetindia.entity.User;
import lombok.Data;

@Data
public class UserDTO {
    private Integer id;
    private String email;
    private String otp;
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
    public static UserDTO toUserDTO(User user,Integer status,String sMsg) {
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setStatus(status);
        dto.setMessage(sMsg);
        return dto;
    }
}
