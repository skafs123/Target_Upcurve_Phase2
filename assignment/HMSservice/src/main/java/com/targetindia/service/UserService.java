package com.targetindia.service;

import com.targetindia.entity.User;
import com.targetindia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository repo;

    public User getUser(Integer id) throws ServiceException {
        try{
            return repo.findById(id).orElse(null);
        }
        catch (Exception ex){
            throw new ServiceException(ex);
        }
    }


    public int validateUser(User user) throws ServiceException {
        try{
            User userFromDB = repo.findByEmail(user.getEmail());
            if(userFromDB != null)
            {
                //throw new ServiceException(userFromDB.getPassword() + "::"+ user.getPassword());
                if(userFromDB.getPassword().equals(user.getPassword()))
                    return 1;
                else return 2; //invalid password
            }
            else return 3; //invalid user/email id
        }
        catch (Exception ex){
            throw new ServiceException(ex);
        }
    }

    public List<User> getAllUser() throws ServiceException{
        try{
            return repo.findAll();
        }
        catch (Exception ex){
            throw new ServiceException(ex);
        }
    }
    public Page<User> getAllUser(int page, int size, String sortBy){
        Pageable p = PageRequest.of(page-1, size, Sort.by(Sort.Direction.ASC, sortBy));
        return repo.findAll(p);
    }

}
