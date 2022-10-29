package com.vttp.backend.controllers;

import java.security.Principal;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.models.UserInfo;
import com.vttp.backend.services.UserService;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    // add users
    // modify user info

    private Logger logger = Logger.getLogger(UserController.class.getName());

    @Autowired
    private UserService userSvc;

    @GetMapping(path = "/myprofile")
    public ResponseEntity<String> getOwnUserInfo(Principal principal) {
        String username = principal.getName();
        logger.info("Getting user info for user: " + username);
        return getUserInfo(username);
    }

    // general getter in case need other users' info
    public ResponseEntity<String> getUserInfo(String username) {
        Optional<UserInfo> opt = userSvc.getUserInfoFromUsername(username);
        if (opt.isPresent()) {
            UserInfo userInfo = opt.get();
            return ResponseEntity.ok(userInfo.toJsonObject().toString());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
