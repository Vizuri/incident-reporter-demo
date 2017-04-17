package com.redhat.vizuri.demo.domain;

import java.io.Serializable;
import java.util.Date;

public class Comment implements Serializable {
	private static final long serialVersionUID = -1801159038875213166L;

	private String message;
	private String title;
	private String commenterName;
	private Date commentDate;
	
	public Comment() {
		super();
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCommenterName() {
		return commenterName;
	}

	public void setCommenterName(String commenterName) {
		this.commenterName = commenterName;
	}

	public Date getCommentDate() {
		return commentDate;
	}

	public void setCommentDate(Date commentDate) {
		this.commentDate = commentDate;
	}

	@Override
	public String toString() {
		return "Comment [message=" + message + ", title=" + title + ", commenterName=" + commenterName
				+ ", commentDate=" + commentDate + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((commentDate == null) ? 0 : commentDate.hashCode());
		result = prime * result + ((commenterName == null) ? 0 : commenterName.hashCode());
		result = prime * result + ((message == null) ? 0 : message.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
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
		Comment other = (Comment) obj;
		if (commentDate == null) {
			if (other.commentDate != null)
				return false;
		} else if (!commentDate.equals(other.commentDate))
			return false;
		if (commenterName == null) {
			if (other.commenterName != null)
				return false;
		} else if (!commenterName.equals(other.commenterName))
			return false;
		if (message == null) {
			if (other.message != null)
				return false;
		} else if (!message.equals(other.message))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}
	
}
