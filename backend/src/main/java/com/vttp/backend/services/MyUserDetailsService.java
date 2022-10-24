package com.vttp.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vttp.backend.repositories.LoginRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private LoginRepository loginRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserDetails> opt = loginRepo.loadUserByUsername(username);
        if (opt.isPresent()) {
            return opt.get();
        } else {
            throw new UsernameNotFoundException("Unable to retrieve user: " + username);
        }
    }

}
