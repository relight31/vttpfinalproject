package com.vttp.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.vttp.backend.services.ExchangeRateService;
import com.vttp.backend.services.ListingService;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private ExchangeRateService rateService;

	@Autowired
	private ListingService listingSvc;

	@Test
	void contextLoads() {
	}

	@Test
	void exchangeRateERHTest() {
		rateService.getDailyRatesERH("SGD", "MYR");
	}

	@Test
	void singleListingTest() {
		listingSvc.getListingById(1);
	}

	@Test
	void multipleListingsTest(){
		listingSvc.getListingsByCurrencies("SGD", "MYR");
	}
}
