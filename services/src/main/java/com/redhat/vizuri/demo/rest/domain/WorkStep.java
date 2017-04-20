package com.redhat.vizuri.demo.rest.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class WorkStep implements Serializable {
	private static final long serialVersionUID = 3221232450657355357L;

	@Id
	@GeneratedValue
	private Long id;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="TICKET_ID")
	private WorkTicket ticket;
	
	@Column(nullable = false)
	private String description;
	
	@Column
	private Integer displayOrder;
	
	@Column(nullable = false)
	private Boolean required;
	
	@Column
	private Boolean completed;
	
	protected WorkStep() {
	}

	public WorkTicket getTicket() {
		return ticket;
	}
	
	public String getDescription() {
		return description;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public Boolean getRequired() {
		return required;
	}

	public Boolean getCompleted() {
		return completed;
	}

	@Override
	public String toString() {
		return "WorkStep [id=" + id + ", description=" + description + ", displayOrder=" + displayOrder + ", required=" + required
				+ ", completed=" + completed + "]";
	}
	
}
