package com.redhat.vizuri.demo.rest.dto;

import java.io.Serializable;

public class ActionResponse implements Serializable {
	private static final long serialVersionUID = -8544870532520723366L;

	private String message;
	private String details;
	private Object result;
	
	public ActionResponse() {
		super();
	}

	public ActionResponse(String message, String details, Object result) {
		super();
		this.message = message;
		this.details = details;
		this.result = result;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	@Override
	public String toString() {
		return "ActionResponse [message=" + message + ", details=" + details + ", result=" + result + "]";
	}
	
}
