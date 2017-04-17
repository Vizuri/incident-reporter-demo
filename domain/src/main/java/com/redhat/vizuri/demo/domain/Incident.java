package com.redhat.vizuri.demo.domain;

import java.io.Serializable;
import java.util.Date;

public class Incident implements Serializable {
	private static final long serialVersionUID = -1164413366918727474L;

	private Long id;
	private Long reporterUserId;
	private String incidentType;
	private String description;
	private Date incidentDate;
	
	private String buildingName;
	private String stateCode;
	private String zipCode;
	
	private Severity severity;
	
	public Incident() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getReporterUserId() {
		return reporterUserId;
	}

	public void setReporterUserId(Long reporterUserId) {
		this.reporterUserId = reporterUserId;
	}

	public String getIncidentType() {
		return incidentType;
	}

	public void setIncidentType(String type) {
		this.incidentType = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getIncidentDate() {
		return incidentDate;
	}

	public void setIncidentDate(Date incidentDate) {
		this.incidentDate = incidentDate;
	}

	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public Severity getSeverity() {
		return severity;
	}

	public void setSeverity(Severity severity) {
		this.severity = severity;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Incident other = (Incident) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Incident [id=" + id + ", reporterUserId=" + reporterUserId + ", incidentType=" + incidentType + ", description="
				+ description + ", incidentDate=" + incidentDate + ", buildingName=" + buildingName + ", stateCode="
				+ stateCode + ", zipCode=" + zipCode + ", severity=" + severity + "]";
	}

}
