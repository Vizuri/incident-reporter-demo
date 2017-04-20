--
-- Sample dataset some incidents and work tickets
--

-- =================================================================================================

insert into work_ticket(priority,status,worker_id) values (5,'assigned',99);
insert into work_ticket(priority,status,worker_id) values (10,'completed',99);

insert into work_step(ticket_id, description, required, display_order, completed) values (1, 'Step one description', 1, false, false);
insert into work_step(ticket_id, description, required, display_order, completed) values (1, 'Step two description', 2, true, false);
insert into work_step(ticket_id, description, required, display_order, completed) values (1, 'Step three description', 3, false, false);

insert into work_step(ticket_id, description, required, display_order, completed) values (2, 'Step one description', 1, false, true);
insert into work_step(ticket_id, description, required, display_order, completed) values (2, 'Step two description', 2, true, true);
insert into work_step(ticket_id, description, required, display_order, completed) values (2, 'Step three description', 3, false, false);

insert into incident_report (reporter_id, name, details, building, state, severity) values (88, 'Incident 1', 'Incident 1 details', 'building-a', 'VA', 'danger');
insert into incident_report (reporter_id, name, details, building, state, severity) values (88, 'Incident 2', 'Incident 2 details', 'building-b', 'MD', 'routine');