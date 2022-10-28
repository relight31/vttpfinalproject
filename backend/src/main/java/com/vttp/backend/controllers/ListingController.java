package com.vttp.backend.controllers;

import static com.vttp.backend.services.ListingService.listingsToArray;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.models.Listing;
import com.vttp.backend.services.ListingService;

import jakarta.json.JsonArray;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class ListingController {
    private Logger logger = Logger.getLogger(ListingController.class.getName());

    @Autowired
    private ListingService listingSvc;

    @GetMapping(path = "/listings")
    public ResponseEntity<String> getListings(
            @RequestParam String currFrom,
            @RequestParam String currTo) {
        List<Listing> listings = listingSvc.getListingsByCurrencies(
                currFrom,
                currTo);
        JsonArray results = listingsToArray(listings);
        if (results.size() > 0) {
            return ResponseEntity.ok(results.toString());
        } else {
            logger.info("No results retrieved from service");
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/listing/{listingId}")
    public ResponseEntity<String> getListing(@PathVariable int listingId) {
        Optional<Listing> opt = listingSvc.getListingById(listingId);
        if (opt.isPresent()) {
            Listing listing = opt.get();
            return ResponseEntity.ok(listing.toJsonObject().toString());
        } else {
            logger.info("Unable to retrieve specific listing " + listingId);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(path = "/addlisting")
    public ResponseEntity<String> addListing(@RequestBody String payload) {
        // TODO add listing method
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping(path = "/getFavourites")
    public ResponseEntity<String> getFavourites(Principal principal) {
        String username = principal.getName();
        List<Listing> favourites = listingSvc.getFavourites(username);
        JsonArray results = listingsToArray(favourites);
        if (results.size() > 0) {
            return ResponseEntity.ok(results.toString());
        } else {
            return ResponseEntity.ok("[]");
        }
    }

    @PostMapping(path = "/addFavourite/{listingId}")
    public ResponseEntity<String> addFavourite(
            @PathVariable int listingId,
            Principal principal) {
        String username = principal.getName();
        try {
            listingSvc.addFavourite(listingId, username);
        } catch (Exception e) {
            // TODO: handle exception
        }
        return getFavourites(principal);
    }

    @DeleteMapping(path = "/deleteFavourite/{listingId}")
    public ResponseEntity<String> deleteFavourite(
            @PathVariable int listingId,
            Principal principal) {
        String username = principal.getName();
        try {
            listingSvc.removeFavourite(listingId, username);
        } catch (Exception e) {
            // TODO: handle exception
        }
        return getFavourites(principal);
    }
}
