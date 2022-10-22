package com.vttp.backend.repositories;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.vttp.backend.models.Listing;

@Repository
public class ListingRepository {
    private Logger logger = Logger.getLogger(ListingRepository.class.getName());

    @Autowired
    private JdbcTemplate template;

    private final String SQL_GET_LISTING_BY_ID = "select * from listingsview where listing_id=?";
    private final String SQL_GET_LISTINGS_BY_CURR = "select * from listingsview where curr_from =? and curr_to = ?";

    public Optional<Listing> getListingById(int listingId) {
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_GET_LISTING_BY_ID,
                listingId);
        if (rowSet.next()) {
            logger.info("Listing found in DB");
            return Optional.of(Listing.fromRowset(rowSet));
        }
        logger.info("No such listing found in DB");
        return Optional.empty();
    }

    public List<Listing> getListingsByCurrencies(
            String currFrom,
            String currTo) {
        List<Listing> listings = new LinkedList<>();
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_GET_LISTINGS_BY_CURR,
                currFrom,
                currTo);
        logger.info("rowSet retrieved from DB");
        while (rowSet.next()) {
            listings.add(Listing.fromRowset(rowSet));
        }
        logger.info("returning list of " + listings.size() + " listings");
        return listings;
    }
}
