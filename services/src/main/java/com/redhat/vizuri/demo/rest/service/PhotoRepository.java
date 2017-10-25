package com.redhat.vizuri.demo.rest.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.net.HttpHeaders;
import com.redhat.vizuri.demo.rest.dto.ActionResponse;
import com.redhat.vizuri.demo.rest.dto.FileDetails;

@RestController
public class PhotoRepository {
	
	private static Logger log = Logger.getLogger(PhotoRepository.class);
	private static Map<String, Set<String>> fileNameTable = new HashMap<String, Set<String>>();
	
	@CrossOrigin
	@PostMapping("/photos/{processId:.+}")
	public ResponseEntity<ActionResponse> pictureUpload(@RequestParam("file") MultipartFile file, @PathVariable("processId") String processId) {
		log.info("Filename: " + file.getName());
		log.info("Original filename: " + file.getOriginalFilename());
		log.info("File size: " + file.getSize());
		
		String fileName = processId + "-" + file.getOriginalFilename();
		try {
			Path downloadedFile = Paths.get(fileName);
			Files.deleteIfExists(downloadedFile);
			
			Files.copy(file.getInputStream(), downloadedFile);
			
			if (fileNameTable.get(processId) == null) {
				fileNameTable.put(processId, new HashSet<String>());
			}
			
			fileNameTable.get(processId).add(file.getOriginalFilename());
			
			return ResponseEntity.ok().body(new ActionResponse("successful file upload", file.getOriginalFilename(), true));
		} catch (IOException ex) {
			log.error("Error uploading picture", ex);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ActionResponse("Error uploading file " + fileName, ex.getMessage(), false));
		}
	}
	
	@CrossOrigin
	@GetMapping("/photos/{processId:.+}/{fileName:.+}")
	@ResponseBody
	public ResponseEntity<Resource> pictureDownload(@PathVariable String processId, @PathVariable String fileName) {
		String fullName = processId + "-" + fileName;
		log.info("Received request for: " + fullName);
		
		Path file = Paths.get(fullName);
		
		Resource resource;
		try {
			resource = new UrlResource(file.toUri());
			
			return ResponseEntity
					.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName()+"\"")
					.body(resource);
		} catch (MalformedURLException e) {
			log.error("Could not locate file", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@CrossOrigin
	@GetMapping("/photos/{processId:.+}")
	@ResponseBody
	public ResponseEntity<ActionResponse> incidentPictureList(@PathVariable String processId) {
		ActionResponse actionResponse = new ActionResponse();
		List<FileDetails> fileDetails = new ArrayList<FileDetails>();
		
		if (fileNameTable.containsKey(processId)) {
			for (String fileName : fileNameTable.get(processId)) {
				fileDetails.add(new FileDetails(processId, fileName, processId + "/" + fileName));
			}
			actionResponse.setResult(fileDetails);
		}
		
		return ResponseEntity.ok().body(actionResponse);
	}
	
	@CrossOrigin
	@DeleteMapping("/photos/{processId:.+}/{fileName:.+}") 
	public boolean deleteSinglePicture(@PathVariable String processId, @PathVariable String fileName) {
		return deleteFile(processId, fileName);
	}
	
	@CrossOrigin
	@DeleteMapping("/photos/{processId:.+}")
	public boolean deleteAllPhotosForProcess(@PathVariable String processId) {
		return deleteAllProcessFiles(processId);
	}
	
	@CrossOrigin
	@DeleteMapping("/photos")
	public boolean deleteAllPhotos() {
		boolean allDeleted = true;
		
		for (String processId : fileNameTable.keySet()) {
			allDeleted = allDeleted & deleteAllProcessFiles(processId);
		}
		
		return allDeleted;
	}
	
	private boolean deleteAllProcessFiles(String processId) {
		boolean allDeleted = true;
		if (fileNameTable.get(processId) != null) {
			for(String fileName : fileNameTable.get(processId)) {
				allDeleted = allDeleted & deleteFile(processId, fileName);
			}
		}
		return allDeleted;
	}
	
	private boolean deleteFile(String processId, String fileName) {
		Path filePath = Paths.get(fileName);
		try {
			if (fileNameTable.get(processId) != null) {
				fileNameTable.get(processId).remove(fileName);
			}
			return Files.deleteIfExists(filePath);
		} catch (IOException e) {
			log.error("Error deleting file: " + fileName, e);
			return false;
		}
	}
}
