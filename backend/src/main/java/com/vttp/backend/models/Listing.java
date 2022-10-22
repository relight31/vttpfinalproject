package com.vttp.backend.models;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class Listing {
    private int listingId;
    private String title;
    private int userId;
    private String username;
    private String currFrom;
    private String currTo;
    private float rate;
    private String description;

    public int getListingId() {
        return this.listingId;
    }

    public void setListingId(int listingId) {
        this.listingId = listingId;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

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

    public String getCurrFrom() {
        return this.currFrom;
    }

    public void setCurrFrom(String currFrom) {
        this.currFrom = currFrom;
    }

    public String getCurrTo() {
        return this.currTo;
    }

    public void setCurrTo(String currTo) {
        this.currTo = currTo;
    }

    public float getRate() {
        return this.rate;
    }

    public void setRate(float rate) {
        this.rate = rate;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static Listing fromRowset(SqlRowSet rowSet) {
        Listing listing = new Listing();
        listing.setListingId(rowSet.getInt("listing_id"));
        listing.setTitle(rowSet.getString("title"));
        listing.setUserId(rowSet.getInt("user_id"));
        listing.setCurrFrom(rowSet.getString("curr_from"));
        listing.setCurrTo(rowSet.getString("curr_to"));
        listing.setRate(rowSet.getFloat("rate"));
        listing.setDescription(rowSet.getString("description"));
        listing.setUsername(rowSet.getString("username"));
        return listing;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
                .add("listingId", listingId)
                .add("title", title)
                .add("userId", userId)
                .add("currFrom", currFrom)
                .add("currTo", currTo)
                .add("rate", rate)
                .add("description", description)
                .add("username", username)
                .build();
    }
}
