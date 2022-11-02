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
import com.vttp.backend.models.ListingRequest;

@Repository
public class ListingRepository {
    private Logger logger = Logger.getLogger(ListingRepository.class.getName());

    @Autowired
    private JdbcTemplate template;

    private final String SQL_GET_LISTING_BY_ID = "select * from listingsview where listing_id=?";
    private final String SQL_GET_LISTINGS_BY_CURR = "select * from listingsview where curr_from =? and curr_to = ?";
    private final String SQL_GET_LISTINGS_BY_USERNAME = "select * from listingsview where username = ?";
    private final String SQL_ADD_LISTING = "insert into listings (title, user_id, curr_from, curr_to, rate, description) values (?,?,?,?,?,?)";
    private final String SQL_DELETE_LISTING = "delete from listings where listing_id =?";

    private final String SQL_GET_FAVOURITES_BY_USERNAME = "select * from favouritesview where username = ?";
    private final String SQL_ADD_FAVOURITE = "insert into favourites (user_id, listing_id) values (?,?)";
    private final String SQL_DELETE_FAVOURITE = "delete from favourites where favourite_id = ?";
    private final String SQL_GET_FAV_ID = "select * from favourites where user_id = ? and listing_id = ?";
    private final String SQL_IS_IN_FAVOURITES = "select * from favouritesview where username = ? and listing_id = ?";

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

    public List<Listing> getListingsByUsername(String username) {
        List<Listing> listings = new LinkedList<>();
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_GET_LISTINGS_BY_USERNAME,
                username);
        while (rowSet.next()) {
            listings.add(Listing.fromRowset(rowSet));
        }
        return listings;
    }

    public boolean addListing(ListingRequest listing, int userId) {
        return template.update(SQL_ADD_LISTING,
                listing.title(),
                userId,
                listing.currFrom(),
                listing.currTo(),
                listing.rate(),
                listing.description()) == 1;
    }

    public boolean deleteListing(int listingId) {
        return template.update(SQL_DELETE_LISTING, listingId) == 1;
    }

    public boolean isInFavourites(int listingId, String username) {
        SqlRowSet rowSet = template.queryForRowSet(
                SQL_IS_IN_FAVOURITES,
                username,
                listingId);
        return rowSet.next();
    }

    public List<Listing> getFavourites(String username) {
        List<Listing> favourites = new LinkedList<>();
        SqlRowSet rowSet = template.queryForRowSet(SQL_GET_FAVOURITES_BY_USERNAME,
                username);
        logger.info("rowSet retrieved from DB");
        while (rowSet.next()) {
            favourites.add(Listing.fromRowset(rowSet));
        }
        logger.info("returning list of " + favourites.size() + " favourites");
        return favourites;
    }

    public boolean addFavourite(int listingId, int userId) {
        return template.update(SQL_ADD_FAVOURITE,
                userId,
                listingId) == 1;
    }

    public boolean removeFavourite(int listingId, int userId) {
        // get primary key favourite_id first
        SqlRowSet rowSet = template.queryForRowSet(SQL_GET_FAV_ID,
                userId,
                listingId);
        rowSet.next(); // exception here if not found
        int favouriteId = rowSet.getInt("favourite_id");
        logger.info("favourite_id: " + favouriteId);
        return template.update(SQL_DELETE_FAVOURITE, favouriteId) == 1;
    }
}
