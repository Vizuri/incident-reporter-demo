
package com.redhat.vizuri.demo.rest;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("scratch")
// Separate profile for web tests to avoid clashing databases
public class SampleDataRestApplicationTests {

	@Autowired
	private WebApplicationContext context;

	private MockMvc mvc;

	@Before
	public void setUp() {
		this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();
	}

	@Test
	public void testHome() throws Exception {

		this.mvc.perform(get("/api")).andExpect(status().isOk())
				.andExpect(content().string(containsString("tickets")));
	}

	@Test
	public void findByWorkerIdAndStatus() throws Exception {

		this.mvc.perform(
				get("/api/tickets/search/findByWorkerIdAndStatus?workerId=99&&status=completed"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("priority", equalTo(10)));
	}

	@Test
	public void findByContaining() throws Exception {

		this.mvc.perform(
				get("/api/incidents/search/findByBuildingAllIgnoringCase?building=building-a"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("state", equalTo("VA")));
	}
}
