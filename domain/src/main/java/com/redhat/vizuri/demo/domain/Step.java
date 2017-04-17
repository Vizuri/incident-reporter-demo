package com.redhat.vizuri.demo.domain;

import java.io.Serializable;

public class Step implements Serializable {
	private static final long serialVersionUID = -4196794436167870430L;
	
	private Long remediationId;
	private Integer order;
	private String description;
	private boolean required;
	private boolean completed;
	
	public Step() {
		super();
	}

	public Long getRemediationId() {
		return remediationId;
	}

	public void setRemediationId(Long remediationId) {
		this.remediationId = remediationId;
	}

	public Integer getOrder() {
		return order;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isRequired() {
		return required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((order == null) ? 0 : order.hashCode());
		result = prime * result + ((remediationId == null) ? 0 : remediationId.hashCode());
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
		Step other = (Step) obj;
		if (order == null) {
			if (other.order != null)
				return false;
		} else if (!order.equals(other.order))
			return false;
		if (remediationId == null) {
			if (other.remediationId != null)
				return false;
		} else if (!remediationId.equals(other.remediationId))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Step [remediationId=" + remediationId + ", order=" + order + ", description=" + description
				+ ", required=" + required + ", completed=" + completed + "]";
	}

}
