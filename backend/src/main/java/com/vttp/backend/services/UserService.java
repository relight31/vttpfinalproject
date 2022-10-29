package com.vttp.backend.services;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.vttp.backend.models.UserInfo;
import com.vttp.backend.repositories.UserInfoRepository;

@Service
public class UserService {
    // manage user information
    // add new users
    Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserInfoRepository userInfoRepo;

    @Autowired
    private AmazonS3 s3;

    private final String SPACES_URL = "https://filebucket.sgp1.digitaloceanspaces.com/%s";

    public Optional<UserInfo> getUserInfoFromUsername(String username) {
        return userInfoRepo.getUserInfoFromUsername(username);
    }

    public String uploadPhoto(MultipartFile photo, String username) throws IOException {
        // set object metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(photo.getContentType());
        metadata.setContentLength(photo.getSize());

        String uuid = UUID.randomUUID().toString().substring(0, 8);

        PutObjectRequest putReq = new PutObjectRequest(
                "filebucket",
                "profilepics/%s/%s".formatted(
                        username, uuid + photo.getOriginalFilename()),
                photo.getInputStream(),
                metadata);
        putReq = putReq.withCannedAcl(CannedAccessControlList.PublicRead);
        PutObjectResult putResult = s3.putObject(putReq);
        String keyString = SPACES_URL.formatted(putReq.getKey());
        return keyString;
    }

    public boolean updateProfilePic(String path, String username) {
        Optional<UserInfo> opt = userInfoRepo.getUserInfoFromUsername(username);
        if (opt.isPresent()) {
            logger.info("Successfully retrieved userinfo record for user: " + username);
            UserInfo userInfo = opt.get();
            return userInfoRepo.updateProfilePic(
                    path, userInfo.getUserInfoId());
        } else {
            logger.info("Unable to retrieve userinfo record for user: " + username);
            return false;
        }
    }
}
