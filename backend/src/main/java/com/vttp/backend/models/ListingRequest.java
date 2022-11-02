package com.vttp.backend.models;

public record ListingRequest(
        String title,
        String currFrom,
        String currTo,
        String description,
        float rate) {

}
