package org.openshift.quickstarts.decisionserver.hellorules;

import java.io.Serializable;

public class Greeting implements Serializable {
	private static final long serialVersionUID = -8000009795156922236L;
	
	private String salutation;
	
	public Greeting() {
		super();
	}

	public String getSalutation() {
		return salutation;
	}

	public void setSalutation(String salutation) {
		this.salutation = salutation;
	}
	
}
