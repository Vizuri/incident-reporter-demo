package org.openshift.quickstarts.decisionserver.hellorules;

import java.io.Serializable;

public class Person implements Serializable {
	private static final long serialVersionUID = -8583477196607581875L;
	
	private String name;
	
	public Person() {
		super();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	
}
