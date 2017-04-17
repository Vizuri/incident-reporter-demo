package com.redhat.vizuri.demo.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Questionnaire implements Serializable {
	private static final long serialVersionUID = -5567282414759737296L;

	private Long id;
	private String name;
	private List<Question> questions = new ArrayList<Question>();
	private List<Answer> answers = new ArrayList<Answer>();
	private String completedBy;
	private Date completedDate;
	
	public Questionnaire() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

	public List<Answer> getAnswers() {
		return answers;
	}

	public void setAnswers(List<Answer> answers) {
		this.answers = answers;
	}
	
	public void addAnswer(Answer answer) {
		this.answers.add(answer);
	}
	
	public void addQuestion(Question question) {
		this.questions.add(question);
	}
	
	public String getCompletedBy() {
		return completedBy;
	}

	public void setCompletedBy(String completedBy) {
		this.completedBy = completedBy;
	}

	public Date getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(Date completedDate) {
		this.completedDate = completedDate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((answers == null) ? 0 : answers.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((questions == null) ? 0 : questions.hashCode());
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
		Questionnaire other = (Questionnaire) obj;
		if (answers == null) {
			if (other.answers != null)
				return false;
		} else if (!answers.equals(other.answers))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (questions == null) {
			if (other.questions != null)
				return false;
		} else if (!questions.equals(other.questions))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Questionnaire [id=" + id + ", name=" + name + ", questions=" + questions + ", answers=" + answers + "]";
	}
	
	
}
