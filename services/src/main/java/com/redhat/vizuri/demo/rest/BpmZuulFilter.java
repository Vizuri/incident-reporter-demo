package com.redhat.vizuri.demo.rest;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

public class BpmZuulFilter extends ZuulFilter {
	private static Logger log = Logger.getLogger(BpmZuulFilter.class);

	@Override
	public int filterOrder() {
		return 1;
	}

	@Override
	public String filterType() {
		return "pre";
	}

	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		log.info(String.format("%s request to %s", request.getMethod(), request.getRequestURL().toString()));

		if (log.isDebugEnabled()) {
			Enumeration<String> headerNames = request.getHeaderNames();
			while (headerNames.hasMoreElements()) {
				String headerName = headerNames.nextElement();
				log.debug(">>> Header: " + headerName + " = " + String.valueOf(request.getHeader(headerName)));
			}
		}
		return null;
	}

	@Override
	public boolean shouldFilter() {
		return true;
	}
}
