package com.targetindia.service;

import com.targetindia.dto.UserDTO;
import com.targetindia.entity.User;
import com.targetindia.exceptions.ResourceNotFoundException;
import com.targetindia.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;


@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    @Autowired
    private EmailService emailService;

    private Map<String, String> otpStorage = new HashMap<>();
    private Map<String, LocalDateTime> otpExpiry = new HashMap<>();


    static String hashPassword(String password) {
       BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
       return passwordEncoder.encode(password);
   }
     static boolean verifyPassword(String inputPassword, String storedHash) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(inputPassword, storedHash);
    }

    public UserDTO validateUser(User user) {

        User userFromDB = repo.findByEmail(user.getEmail());
        if(userFromDB != null)
        {
            String inputPassword = user.getPassword();
            String storedHash = userFromDB.getPassword();
            boolean match = verifyPassword(inputPassword,storedHash);
            if(match == true) {
                return UserDTO.toUserDTO(userFromDB,1,"Login successful");
                //return 1; //success
            }
            else {
                return UserDTO.toUserDTO(userFromDB,0,"Wrong email or password. Try again");
                //return 0; //invalid password
            }
        }
        else {
            return UserDTO.toUserDTO(user,0,"Wrong email or password. Try again");
            //return 0; //invalid user/email id
        }

    }

    public UserDTO sendOTP(User user) throws MessagingException {

        User userFromDB = repo.findByEmail(user.getEmail());
        if(userFromDB != null)
        {
            //get email
            String email = userFromDB.getEmail();
            String name = userFromDB.getName();

            // Generate a 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999999));

            String subject = String.format("%s, here's your pin %s", name, otp);
            // Store the OTP and its expiry time
            otpStorage.put(email, otp);
            otpExpiry.put(email, LocalDateTime.now().plusMinutes(10)); // OTP valid for 10 minute
            emailService.sendOtpEmail(email, name, subject, otp);

            //return otp;

            //return 1;
            //TODO email has to be masked
            String sMsg = "We have sent a verification code to the registered email ID " ;
            return UserDTO.toUserDTO(user,1,sMsg);
        }
        else
        {

            //return 0;
            String sMsg = "This email address does not exist in our database. Please try again with your registered email-id";
            return UserDTO.toUserDTO(user,0,sMsg);
        }

    }

    public UserDTO validateOTP(UserDTO user) {

        User userFromDB = repo.findByEmail(user.getEmail());
        if(userFromDB != null)
        {
            //validate otp
            String  userOtp =user.getOtp();
            String email = user.getEmail();

            if (otpStorage.containsKey(email) && otpExpiry.containsKey(email)) {
                if (otpStorage.get(email).equals(userOtp) && otpExpiry.get(email).isAfter(LocalDateTime.now())) {
                    otpStorage.remove(email);
                    otpExpiry.remove(email);

                    //return 1; //success
                    String sMsg = "Valid OTP. Proceed to change Password ";
                    user.setStatus(1);
                    user.setMessage(sMsg);
                    return user;
                    //return UserDTO.toUserDTO(user,1,sMsg);
                }
            }
            //return 0;
            String sMsg = "Invalid OTP. Try again";
            user.setStatus(0);
            user.setMessage(sMsg);
            return user;
            //return UserDTO.toUserDTO(user,0,sMsg);

        }

        else
        {
            //return 0;
            String sMsg = "Invalid email ID. Try again";
            user.setStatus(0);
            user.setMessage(sMsg);
            return user;
            //return UserDTO.toUserDTO(user,0,sMsg);
        }

    }
    public UserDTO changePassword(User user) {

        User userFromDB = repo.findByEmail(user.getEmail());
        if(userFromDB != null)
        {
            String inputPassword = user.getPassword();
            String storedHash = userFromDB.getPassword();
            boolean match = verifyPassword(inputPassword,storedHash);
            if(match == false)
            {
                //set the new password

                String newHash = hashPassword(inputPassword);
                userFromDB.setPassword(newHash);
                repo.save(userFromDB);
               // return 1;//"Password Changed "
                return UserDTO.toUserDTO(userFromDB,1,"Password Changed ");
            }
            else {
                //return 0; //"Cannot reuse passwords"
                return UserDTO.toUserDTO(userFromDB,0,"Cannot reuse passwords");
            }

        }
        else {
            //return 0;//"Invalid email ID. Try again"
            return UserDTO.toUserDTO(user,0,"Invalid email ID. Try again");
        }

    }

}
