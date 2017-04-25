package com.redhat.vizuri.demo.rest.dto;

import java.io.Serializable;

public class FileDetails implements Serializable {
	private static final long serialVersionUID = -8227746620448071329L;
	
	private String processId;
	private String fileName;
	private String url;
	
	public FileDetails() {
		super();
	}
	
	public FileDetails(String processId, String fileName, String url) {
		super();
		this.processId = processId;
		this.fileName = fileName;
		this.url = url;
	}

	public String getProcessId() {
		return processId;
	}

	public void setProcessId(String processId) {
		this.processId = processId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "FileDetails [processId=" + processId + ", fileName=" + fileName + ", url=" + url + "]";
	}
	
}
