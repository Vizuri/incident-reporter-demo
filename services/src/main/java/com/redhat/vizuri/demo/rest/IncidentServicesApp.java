package com.redhat.vizuri.demo.rest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;

/**
 * 
 * @author kspokas
 *
 */
@EnableZuulProxy
@SpringBootApplication
public class IncidentServicesApp extends SpringBootServletInitializer {

	public static void main(String[] args) throws Exception {
		SpringApplication.run(IncidentServicesApp.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(IncidentServicesApp.class);
	}

	@Bean
	public BpmZuulFilter simpleFilter() {
		return new BpmZuulFilter();
	}

}
