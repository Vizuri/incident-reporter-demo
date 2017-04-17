package com.redhat.vizuri.demo.domain;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Answer implements Serializable {
	private static final long serialVersionUID = -2811773784154293610L;
	
	private String questionId;
	private String groupId;
	private String strValue;
	private boolean updatedValue;
	private Date lastUpdated;
	private final String dateFormat = "yyyy-MM-dd";
	private boolean delete;
	
	public Answer() {
	}

	public Answer(String questionId, String strValue) {
		super();
		this.questionId = questionId;
		this.strValue = strValue;
	}


	public String getQuestionId() {
		return questionId;
	}

	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}

	public String getStrValue() {
		return strValue;
	}

	public void setStrValue(String srtValue) {
		this.lastUpdated = new Date();
		this.strValue = srtValue;
	}

	public Date getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}

	public int getNumValue() {
		if (strValue != null && !strValue.isEmpty()){
			try{
				return Integer.parseInt(strValue);
			}
			catch(Exception e){
				return -1;
			}
		}
		return -1;
	}

	public void setNumValue(int numValue) {
		setStrValue(Integer.toString(numValue));
	}
	
	public float getDecValue() {
		if (strValue != null && !strValue.isEmpty()){
			try{
				return Float.parseFloat(strValue);
			}
			catch(Exception e){
				return -1.0f;
			}
		}
		return 0.0f;
	}

	public void setDecValue(float decValue) {
		setStrValue(Float.toString(decValue));
	}
	
	// pass in Yes/yes, No/no and true/false
	public boolean getBoolValue() {
		if (strValue != null && !strValue.isEmpty()){
			if (strValue.equalsIgnoreCase("Yes")){
				return true;
			} else if (strValue.equalsIgnoreCase("No")){
				return false;
			} else{
				return Boolean.parseBoolean(strValue);
			}
		}
		return false;
	}
	
	public void setBoolValue(boolean boolValue) {
		setStrValue(Boolean.toString(boolValue));
	}
	
	public Date getDateValue() {
		if (strValue != null && strValue.length() == dateFormat.length()){
			
			try{
				return new SimpleDateFormat(dateFormat).parse(strValue);
			}
			catch(Exception e){
				return null;
			}
			
		}
		return null;
	}
	
	// use date format "2015-08-18":yyyy-MM-dd
	public void setDateValue(Date date) {
		
		if (date != null){
			setStrValue(new SimpleDateFormat(dateFormat).format(date));
		}
		else{
			setStrValue("");
		}
	}

	public boolean isUpdatedValue() {
		return updatedValue;
	}

	public void setUpdatedValue(boolean updatedValue) {
		this.updatedValue = updatedValue;
	}
	
	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public boolean isDelete() {
		return delete;
	}

	public void setDelete(boolean delete) {
		this.delete = delete;
	}
	
	@Override
	public String toString() {
		return "Answer [questionId=" + questionId + ", groupId=" + groupId
				+ ", strValue=" + strValue + ", updatedValue=" + updatedValue
				+ ", lastUpdated=" + lastUpdated + ", dateFormat=" + dateFormat
				+ ", delete=" + delete + "]";
	}
	
}