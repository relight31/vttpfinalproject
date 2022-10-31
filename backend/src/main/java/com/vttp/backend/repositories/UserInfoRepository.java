package com.vttp.backend.repositories;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import com.vttp.backend.models.UserInfo;

@Repository
public class UserInfoRepository {
    private Logger logger = Logger.getLogger(
            UserInfoRepository.class.getName());

    @Autowired
    private JdbcTemplate template;

    private final String SQL_USERINFO_FROM_USERNAME = "select * from userinfo where username = ?";
    private final String SQL_UPDATE_PROFILE_PIC = "update userinfo set profile_pic = ? where userinfo_id = ?";
    private final String SQL_INSERT_NEW_BLANK_USERINFO = "insert into userinfo (user_id, username, date_joined) values (?,?,?)";

    public int userIdFromUsername(String username) throws UsernameNotFoundException {
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_USERINFO_FROM_USERNAME,
                username);
        if (rowSet.next()) {
            logger.info("User ID for user: " + username + " found");
            return rowSet.getInt("user_id");
        }
        logger.info("User: " + username + " not found");
        throw new UsernameNotFoundException("User: " + username + " not found");
    }

    public Optional<UserInfo> getUserInfoFromUsername(String username) {
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_USERINFO_FROM_USERNAME,
                username);
        if (rowSet.next()) {
            logger.info("User information for user: " + username + " found");
            return Optional.of(UserInfo.fromRowSet(rowSet));
        } else {
            logger.info("User: " + username + " not found");
            return Optional.empty();
        }
    }

    public boolean updateProfilePic(String path, int userInfoId) {
        return template.update(SQL_UPDATE_PROFILE_PIC,
                path,
                userInfoId) == 1;
    }

    public boolean addNewUserInfo(String username, int userId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String today = LocalDate.now().format(formatter);
        return template.update(SQL_INSERT_NEW_BLANK_USERINFO,
                userId,
                username,
                today) == 1;
    }
}
