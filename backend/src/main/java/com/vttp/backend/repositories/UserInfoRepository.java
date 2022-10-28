package com.vttp.backend.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

@Repository
public class UserInfoRepository {
    @Autowired
    private JdbcTemplate template;

    private final String SQL_USERINFO_FROM_USERNAME = "select * from userinfo where username = ?";

    public int userIdFromUsername(String username) throws UsernameNotFoundException {
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_USERINFO_FROM_USERNAME,
                username);
        if (rowSet.next()) {
            return rowSet.getInt("user_id");
        }
        throw new UsernameNotFoundException("User: " + username + " not found");
    }
}
