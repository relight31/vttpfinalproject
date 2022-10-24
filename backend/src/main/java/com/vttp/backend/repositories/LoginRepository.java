package com.vttp.backend.repositories;

import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.vttp.backend.utils.UserRepoUtils;

@Repository
public class LoginRepository {
    private Logger logger = Logger.getLogger(LoginRepository.class.getName());

    @Autowired
    private JdbcTemplate template;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String SQL_LOAD_USER_BY_USERNAME = "select * from users where username = ?";
    private final String SQL_ADD_NEW_USER = "insert into users (username, password, roles) values (?,?,?)";

    public Optional<UserDetails> loadUserByUsername(String username) {
        SqlRowSet result = template.queryForRowSet(
                SQL_LOAD_USER_BY_USERNAME,
                username);
        if (result.next()) {
            logger.info("User record for username: " + username + " found in DB");
            return Optional.of(UserRepoUtils.rowSetToUserDetails(result));
        } else {
            return Optional.empty();
        }
    }

    public boolean addNewUser(
            String username,
            String password,
            String role) {
        return template.update(SQL_ADD_NEW_USER,
                username,
                passwordEncoder.encode(password),
                role) == 1;
    }
}
