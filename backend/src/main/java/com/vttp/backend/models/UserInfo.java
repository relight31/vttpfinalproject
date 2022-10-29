package com.vttp.backend.models;

import java.sql.Date;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class UserInfo {
    private int userId;
    private int userInfoId;
    private String username;
    private String profilePic;
    private Date dateJoined;

    public int getUserId() {
        return this.userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfilePic() {
        return this.profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public Date getDateJoined() {
        return this.dateJoined;
    }

    public void setDateJoined(Date dateJoined) {
        this.dateJoined = dateJoined;
    }

    public int getUserInfoId() {
        return this.userInfoId;
    }

    public void setUserInfoId(int userInfoId) {
        this.userInfoId = userInfoId;
    }

    public static UserInfo fromRowSet(SqlRowSet rowSet) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(rowSet.getInt("user_id"));
        userInfo.setUserInfoId(rowSet.getInt("userinfo_id"));
        userInfo.setUsername(rowSet.getString("username"));
        userInfo.setProfilePic(rowSet.getString("profile_pic"));
        userInfo.setDateJoined(rowSet.getDate("date_joined"));
        return userInfo;
    }

    public JsonObject toJsonObject() {
        // userinfoid intentionally omitted
        return Json.createObjectBuilder()
                .add("userId", userId)
                .add("username", username)
                .add("profilePic", profilePic)
                .add("dateJoined", dateJoined.toString())
                .build();
    }

}
