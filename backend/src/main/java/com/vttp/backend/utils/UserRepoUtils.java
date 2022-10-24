package com.vttp.backend.utils;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserRepoUtils {
    public static UserDetails rowSetToUserDetails(SqlRowSet rowset) {
        String username = rowset.getString("username");
        String password = rowset.getString("password");
        String roles = rowset.getString("roles");

        return User.withUsername(username)
                .password(password)
                .roles(roles)
                .build();
    }

    public static RSAPublicKey getPublicKey(String keyString) throws Exception {
        byte[] encoded = Base64.decodeBase64(keyString);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        return (RSAPublicKey) keyFactory.generatePublic(keySpec);
    }

    public static RSAPrivateKey getPrivateKey(String keyString) throws Exception {
        byte[] encoded = Base64.decodeBase64(keyString);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
        return (RSAPrivateKey) keyFactory.generatePrivate(keySpec);
    }
}
