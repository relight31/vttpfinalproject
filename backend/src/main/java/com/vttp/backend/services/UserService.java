package com.vttp.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vttp.backend.models.UserInfo;
import com.vttp.backend.repositories.UserInfoRepository;

@Service
public class UserService {
    // manage user information
    // add new users
    @Autowired
    private UserInfoRepository userInfoRepo;

    public Optional<UserInfo> getUserInfoFromUsername(String username) {
        return userInfoRepo.getUserInfoFromUsername(username);
    }
}
