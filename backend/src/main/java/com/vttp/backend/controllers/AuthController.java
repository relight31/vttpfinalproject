package com.vttp.backend.controllers;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.models.LoginRequest;
import com.vttp.backend.services.TokenService;
import com.vttp.backend.services.UserService;

@RestController
public class AuthController {
    private Logger logger = Logger.getLogger(AuthController.class.getName());

    @Autowired
    private TokenService tokenSvc;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserService userSvc;

    @PostMapping(path = "/token")
    public ResponseEntity<String> getToken(
            @RequestBody LoginRequest loginRequest) {
        logger.info("Token requested for user: " + loginRequest.username());
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()));
        String token = tokenSvc.generateToken(auth);
        logger.info("token granted: " + token);
        return ResponseEntity.ok(token);
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signUp(@RequestBody LoginRequest signupRequest) {
        // create new account in service
        try {
            userSvc.addNewUser(
                    signupRequest.username(),
                    signupRequest.password());
            return getToken(signupRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Unable to create new user");
        }
    }
}
