package com.vttp.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.vttp.backend.services.ExchangeRateService;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private ExchangeRateService rateService;

	@Test
	void contextLoads() {
	}

	@Test
	void exchangeRateERHTest() {
		rateService.getDailyRatesERH("SGD", "MYR");
	}
}
