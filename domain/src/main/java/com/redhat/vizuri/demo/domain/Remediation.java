package com.redhat.vizuri.demo.domain;

import java.io.Serializable;
import java.util.List;

public class Remediation implements Serializable {
	private static final long serialVersionUID = -5649100321180232507L;
	
	private Long id;
	private Long incidentId;
	private Long workerId;
	
	private Integer priority;
	private Status status;
	private List<Step>steps;
	
	public Remediation() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getIncidentId() {
		return incidentId;
	}

	public void setIncidentId(Long incidentId) {
		this.incidentId = incidentId;
	}

	public Long getWorkerId() {
		return workerId;
	}

	public void setWorkerId(Long workerId) {
		this.workerId = workerId;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public List<Step> getSteps() {
		return steps;
	}

	public void setSteps(List<Step> steps) {
		this.steps = steps;
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
		Remediation other = (Remediation) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Remediation [id=" + id + ", incidentId=" + incidentId + ", workerId=" + workerId + ", priority="
				+ priority + ", status=" + status + ", steps=" + steps + "]";
	}
	
}
