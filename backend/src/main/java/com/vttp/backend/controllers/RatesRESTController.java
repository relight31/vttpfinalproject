package com.vttp.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.vttp.backend.services.ExchangeRateService;

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
        return ResponseEntity.ok("null");
    }
}
