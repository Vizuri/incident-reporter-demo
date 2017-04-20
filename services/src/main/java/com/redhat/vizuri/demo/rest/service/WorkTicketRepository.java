package com.redhat.vizuri.demo.rest.service;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.redhat.vizuri.demo.rest.domain.WorkTicket;

@RepositoryRestResource(collectionResourceRel = "tickets", path = "tickets")
interface WorkTicketRepository extends PagingAndSortingRepository<WorkTicket, Long> {

	WorkTicket findByWorkerIdAndStatus(@Param("workerId")Long workerId, @Param("status") String status);

}
