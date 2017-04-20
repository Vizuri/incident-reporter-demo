package com.redhat.vizuri.demo.rest.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class WorkTicket implements Serializable {
	private static final long serialVersionUID = -9061647726450998601L;

	@Id
	@GeneratedValue
	private Long id;
	
	@Column(nullable = false)
	private Long workerId;

	@OneToMany(mappedBy = "ticket")
	private List<WorkStep> steps;

	@Column
	private Integer priority;

	@Column
	private String status;

	protected WorkTicket() {
	}

	public Long getWorkerId() {
		return workerId;
	}

	public List<WorkStep> getSteps() {
		return steps;
	}

	public Integer getPriority() {
		return priority;
	}

	public String getStatus() {
		return status;
	}

	@Override
	public String toString() {
		return "WorkTicket [id=" + id + ", workerId=" + workerId + ", steps=" + steps + ", priority=" + priority
				+ ", status=" + status + "]";
	}

}
