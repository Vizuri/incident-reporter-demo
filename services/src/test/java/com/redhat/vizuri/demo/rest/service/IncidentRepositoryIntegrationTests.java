package com.redhat.vizuri.demo.rest.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit4.SpringRunner;

import com.redhat.vizuri.demo.rest.domain.IncidentReport;

@RunWith(SpringRunner.class)
@SpringBootTest
public class IncidentRepositoryIntegrationTests {

	@Autowired
	IncidentRepository repository;

	@Test
	public void findsFirstPageOfReports() {

		Page<IncidentReport> reports = this.repository.findAll(new PageRequest(0, 10));
		assertThat(reports.getTotalElements()).isEqualTo(2);
	}

}
