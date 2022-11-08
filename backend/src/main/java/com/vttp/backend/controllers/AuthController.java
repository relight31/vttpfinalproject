package com.vttp.backend.controllers;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.models.LoginRequest;
import com.vttp.backend.services.TokenService;
import com.vttp.backend.services.UserService;

import jakarta.json.Json;

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
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse httpResp) {
        logger.info("Token requested for user: " + loginRequest.username());
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()));
        String token = tokenSvc.generateToken(auth);
        logger.info("token granted: " + token);

        Cookie cookie = new Cookie("token", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(60 * 60); // 1hr, same as token
        httpResp.addCookie(cookie);
        return ResponseEntity.ok("");
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signUp(
            @RequestBody LoginRequest signupRequest,
            HttpServletResponse httpResp) {
        // create new account in service
        try {
            userSvc.addNewUser(
                    signupRequest.username(),
                    signupRequest.password());
            return getToken(signupRequest, httpResp);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Unable to create new user");
        }
    }

    @GetMapping(path = "/logoutt")
    public ResponseEntity<String> logout(
            HttpServletRequest httpReq,
            HttpServletResponse httpResp) {
        HttpStatus status = HttpStatus.OK;
        Cookie[] cookies = httpReq.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    Cookie newCookie = new Cookie("token", null);
                    cookie.setPath("/");
                    cookie.setHttpOnly(true);
                    cookie.setSecure(true);
                    cookie.setMaxAge(0);
                    httpResp.addCookie(newCookie);
                }
            }
        } else {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(
                Json.createObjectBuilder()
                .add("response", "hey")
                .build()
                .toString());
    }
}
