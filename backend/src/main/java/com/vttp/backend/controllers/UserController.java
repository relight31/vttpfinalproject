package com.vttp.backend.controllers;

import java.security.Principal;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(path = "/myprofile/uploadphoto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadPhoto(
            @RequestPart("profilepic") MultipartFile photo,
            Principal principal) {
        String username = principal.getName();
        try {
            String imagePath = userSvc.uploadPhoto(photo, username);
            logger.info("Successfully uploaded image to " + imagePath);
            // update userinfo table
            if (userSvc.updateProfilePic(imagePath, username)) {
                logger.info("Successfully updated userinfo record for user: " + username);
                // return entire userinfo object
                return getUserInfo(username);
            } else {
                logger.info("Could not update userinfo record for user: " + username);
                throw new RuntimeException();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
