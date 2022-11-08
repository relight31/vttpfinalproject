package com.vttp.backend.configs;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.vttp.backend.services.MyUserDetailsService;

@Component
public class JwtCookieRequestFilter extends OncePerRequestFilter {
    private Logger logger = Logger.getLogger(JwtCookieRequestFilter.class.getName());

    @Autowired
    private MyUserDetailsService myUserDetailsSvc;

    @Autowired
    private JwtDecoder jwtDecoder;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("Cookie filter on: "+request.getRequestURI());
        // get JWT string from cookies
        Cookie[] cookies = request.getCookies();
        String jwtCookieString = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    jwtCookieString = cookie.getValue();
                    break;
                }
            }
        }

        // get token
        String username = null;
        if (jwtCookieString != null) {
            // get username
            try {
                username = jwtDecoder.decode(jwtCookieString).getSubject();
            } catch (JwtException e) {
                logger.warning("cannot get username");
            }
        }

        // validate token
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = myUserDetailsSvc.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (UsernameNotFoundException e) {
                logger.warning("Bad token, associate user not found in database");
            }
        }

        // continue chain
        filterChain.doFilter(request, response);
    }
}
