package com.vttp.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.services.ExchangeRateService;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;

import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class RatesRESTController {
    private Logger logger = Logger.getLogger(
            RatesRESTController.class.getName());

    @Autowired
    private ExchangeRateService rateService;

    @GetMapping(path = "/rates")
    public ResponseEntity<String> getRates(
            @RequestParam String currFrom,
            @RequestParam String currTo) {
        Optional<JsonObject> opt = rateService.getDailyRatesERH(
                currFrom, currTo);
        if (opt.isEmpty()) {
            logger.info("Bad request");
            return ResponseEntity.badRequest().build();
        } else {
            logger.info("Successfully got daily exchange rates");
            JsonObject rates = opt.get();
            JsonArray resultArray = Json.createArrayBuilder()
                    .add(rates)
                    .build();
            return ResponseEntity.ok(resultArray.toString());
        }
    }
}
