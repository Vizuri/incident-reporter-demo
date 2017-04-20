package com.redhat.vizuri.demo.rest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.builder.SpringApplicationBuilder;
//import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * Commented out changes to make a WAR deployment
 * @author kspokas
 *
 */
@SpringBootApplication
public class IncidentServicesApp { // extends SpringBootServletInitializer {

	public static void main(String[] args) throws Exception {
		SpringApplication.run(applicationClass, args);
	}
	
	/*@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(applicationClass);
    }*/
	
	private static Class<IncidentServicesApp> applicationClass = IncidentServicesApp.class;

}
