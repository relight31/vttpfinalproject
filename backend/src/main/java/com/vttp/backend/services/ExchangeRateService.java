package com.vttp.backend.services;

import java.io.StringReader;
import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import org.springframework.web.client.RestTemplate;

@Service
public class ExchangeRateService {
    private Logger logger = Logger.getLogger(
            ExchangeRateService.class.getName());

    private static final String url = "https://api.exchangerate.host/timeseries";

    public Optional<JsonObject> getDailyRatesERH(
            String currFrom,
            String currTo) {
        String endDate = Date.valueOf(
                LocalDate.now())
                .toString();
        String startDate = Date.valueOf(
                LocalDate.now()
                        .minusMonths(1))
                .toString();
        logger.info("startDate: " + startDate + ", endDate: " + endDate);
        String weeklyRates = UriComponentsBuilder
                .fromUriString(url)
                .queryParam("start_date", startDate)
                .queryParam("end_date", endDate)
                .queryParam("base", currFrom)
                .queryParam("symbols", currTo)
                .toUriString();
        logger.info("Request URL: " + weeklyRates);

        RequestEntity<Void> req = RequestEntity.get(weeklyRates)
                .accept(MediaType.APPLICATION_JSON)
                .build();
        RestTemplate template = new RestTemplate();
        ResponseEntity<String> resp = template.exchange(req, String.class);
        logger.info("Response gotten");
        JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
        JsonObject object = reader.readObject();
        if (object.containsKey("timeseries") && object.containsKey("rates")) {
            JsonArrayBuilder series = Json.createArrayBuilder();
            JsonObject rates = object.getJsonObject("rates");
            logger.info("rates: " + rates.toString());
            rates.keySet().forEach((date) -> {
                logger.info("date: " + date);
                String name = date;
                logger.info("name: " + name);
                double rate = rates.getJsonObject(date)
                        .getJsonNumber(currTo)
                        .doubleValue();
                logger.info("rate: " + rate);
                series.add(Json.createObjectBuilder()
                        .add("name", name)
                        .add("value", rate)
                        .build());
            });
            JsonObject result = Json.createObjectBuilder()
                    .add("name", "Daily Rates")
                    .add("series", series.build())
                    .build();
            logger.info(result.toString());
            return Optional.of(result);
        } else {
            logger.info("Bad Request to api.exchangerate.host");
            return Optional.empty();
        }
    }
}
