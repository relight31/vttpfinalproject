package com.vttp.backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Component
public class SecurityUtils {
    @Value("${rsa.public-key}")
    private String publicKeyString;

    @Value("${rsa.private-key}")
    private String privateKeyString;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    JwtDecoder jwtDecoder() throws Exception {
        return NimbusJwtDecoder.withPublicKey(
                UserRepoUtils.getPublicKey(publicKeyString))
                .build();
    }

    @Bean
    JwtEncoder jwtEncoder() throws Exception {
        JWK jwk = new RSAKey.Builder(
                UserRepoUtils.getPublicKey(
                        publicKeyString))
                .privateKey(
                        UserRepoUtils.getPrivateKey(privateKeyString))
                .build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(
                new JWKSet(jwk));
        return new NimbusJwtEncoder(jwkSource);
    }
}
