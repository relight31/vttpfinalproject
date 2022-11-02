package com.vttp.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vttp.backend.models.Listing;
import com.vttp.backend.models.ListingRequest;
import com.vttp.backend.repositories.ListingRepository;
import com.vttp.backend.repositories.UserInfoRepository;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepo;

    @Autowired
    private UserInfoRepository userInfoRepo;

    public Optional<Listing> getListingById(int listingId) {
        return listingRepo.getListingById(listingId);
    }

    public List<Listing> getListingsByCurrencies(
            String currFrom, String currTo) {
        return listingRepo.getListingsByCurrencies(currFrom, currTo);
    }

    public List<Listing> getListingsByUsername(String username) {
        return listingRepo.getListingsByUsername(username);
    }

    public boolean addListing(ListingRequest listing, String username) {
        // get userid
        int userId = userInfoRepo.userIdFromUsername(username);
        // add listing
        return listingRepo.addListing(listing, userId);
    }

    public boolean deleteListing(int listingId){
        return listingRepo.deleteListing(listingId);
    }

    public List<Listing> getFavourites(String username) {
        return listingRepo.getFavourites(username);
    }

    @Transactional
    public void addFavourite(int listingId, String username) {
        // get userId with exception
        int userId = userInfoRepo.userIdFromUsername(username);
        // check not alr in favourites
        if (listingRepo.isInFavourites(listingId, username)) {
            throw new IllegalArgumentException("Already in favourites");
        }
        // add to favourites
        if (!listingRepo.addFavourite(listingId, userId)) {
            throw new RuntimeException("Unable to add to favourites");
        }
    }

    @Transactional
    public void removeFavourite(int listingId, String username) {
        // get userId with exception
        int userId = userInfoRepo.userIdFromUsername(username);
        // check in favourites
        if (!listingRepo.isInFavourites(listingId, username)) {
            throw new IllegalArgumentException("Not currently in favourites");
        }
        // delete from favourites
        if (!listingRepo.removeFavourite(listingId, userId)) {
            throw new RuntimeException("Unable to remove from favourites");
        }

    }

    public static JsonArray listingsToArray(List<Listing> listings) {
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        for (Listing listing : listings) {
            arrayBuilder.add(listing.toJsonObject());
        }
        return arrayBuilder.build();
    }
}
