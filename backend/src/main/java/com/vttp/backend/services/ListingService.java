package com.vttp.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vttp.backend.models.Listing;
import com.vttp.backend.repositories.ListingRepository;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepo;

    public Optional<Listing> getListingById(int listingId) {
        return listingRepo.getListingById(listingId);
    }

    public List<Listing> getListingsByCurrencies(String currFrom, String currTo) {
        return listingRepo.getListingsByCurrencies(currFrom, currTo);
    }
}
