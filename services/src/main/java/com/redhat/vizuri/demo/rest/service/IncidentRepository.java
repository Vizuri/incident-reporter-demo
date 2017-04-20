package com.redhat.vizuri.demo.rest.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.redhat.vizuri.demo.rest.domain.IncidentReport;

@RepositoryRestResource(collectionResourceRel = "incidents", path = "incidents")
interface IncidentRepository extends PagingAndSortingRepository<IncidentReport, Long> {

	Page<IncidentReport> findByReporterId(@Param("reporterId") Long reporterId, Pageable pageable);

	IncidentReport findByBuildingAllIgnoringCase(@Param("building") String building);

}
