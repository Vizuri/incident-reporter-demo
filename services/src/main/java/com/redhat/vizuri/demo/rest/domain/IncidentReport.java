package com.redhat.vizuri.demo.rest.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class IncidentReport implements Serializable {
	private static final long serialVersionUID = -8369725134349321397L;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(nullable = false)
	private Long reporterId;

	@Column(nullable = false)
	private String name;
	
	@Column
	private String severity;

	@Column(nullable = false)
	private String state;

	@Column
	private String building;

	@Column
	private String details;

	protected IncidentReport() {
	}

	public IncidentReport(String name) {
		super();
		this.name = name;
	}

	public Long getReporterId() {
		return reporterId;
	}

	public String getName() {
		return name;
	}

	public String getSeverity() {
		return severity;
	}

	public String getState() {
		return state;
	}

	public String getBuilding() {
		return building;
	}

	public String getDetails() {
		return details;
	}

	@Override
	public String toString() {
		return "IncidentReport [id=" + id + ", reporterId=" + reporterId + ", name=" + name + ", severity=" + severity
				+ ", state=" + state + ", building=" + building + ", details=" + details + "]";
	}

}
