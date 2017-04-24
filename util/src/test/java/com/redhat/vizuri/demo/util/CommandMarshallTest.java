package com.redhat.vizuri.demo.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.drools.core.command.impl.GenericCommand;
import org.drools.core.command.runtime.BatchExecutionCommandImpl;
import org.drools.core.command.runtime.process.StartProcessCommand;
import org.drools.core.command.runtime.rule.AgendaGroupSetFocusCommand;
import org.drools.core.command.runtime.rule.FireAllRulesCommand;
import org.drools.core.command.runtime.rule.InsertObjectCommand;
import org.drools.core.command.runtime.rule.QueryCommand;
import org.junit.Test;
import org.kie.server.api.marshalling.Marshaller;
import org.kie.server.api.marshalling.MarshallerFactory;
import org.kie.server.api.marshalling.MarshallingFormat;
import org.openshift.quickstarts.decisionserver.hellorules.Person;

import com.redhat.vizuri.demo.domain.Incident;

public class CommandMarshallTest {
	private static final transient Logger logger = Logger.getLogger(CommandMarshallTest.class);
	
	@Test
	public void testSanity() {
		logger.info("You're ok");
	}
	
	@Test
	public void testMarshallHelloExample() {
		Set<Class<?>> classes = new HashSet<Class<?>>();
        classes.add(Person.class);
        Marshaller marshaller = MarshallerFactory.getMarshaller(classes,  MarshallingFormat.JSON, CommandMarshallTest.class.getClassLoader());
        
        Person person = new Person();
        person.setName("vizuri");
        
        InsertObjectCommand insertCmd = new InsertObjectCommand(person, "person");
        insertCmd.setReturnObject(false);
        
        List<GenericCommand<?>> cmds = new ArrayList<GenericCommand<?>>();
        cmds.add(insertCmd);
        cmds.add(new FireAllRulesCommand("fired"));
        cmds.add(new QueryCommand("greetings", "get greeting"));
        
        BatchExecutionCommandImpl batch = new BatchExecutionCommandImpl(cmds);
        batch.setLookup("HelloRulesSession");
        
        String marshalled = marshaller.marshall(batch);
        logger.info(">>> " + marshalled);
	}
	
	@Test
	public void testMarshallGetAvailableQuestionnaires() {
		Set<Class<?>> classes = new HashSet<Class<?>>();
		classes.add(Incident.class);
		Marshaller marshaller = MarshallerFactory.getMarshaller(classes,  MarshallingFormat.JSON, CommandMarshallTest.class.getClassLoader());
		
		Incident incident = new Incident();
		incident.setIncidentType("windshield");
		
		InsertObjectCommand insertCmd = new InsertObjectCommand(incident, "incident");
		insertCmd.setReturnObject(false);
		
		List<GenericCommand<?>> cmds = new ArrayList<GenericCommand<?>>();
		cmds.add(insertCmd);
		cmds.add(new AgendaGroupSetFocusCommand("construct-customer-questions"));
		cmds.add(new FireAllRulesCommand("construct-fired"));
		cmds.add(new AgendaGroupSetFocusCommand("question-cleanup"));
		cmds.add(new FireAllRulesCommand("cleanup-fired"));
		cmds.add(new AgendaGroupSetFocusCommand("MAIN"));
		cmds.add(new QueryCommand("questionnaires", "get-questionnaires"));
		
		BatchExecutionCommandImpl batch = new BatchExecutionCommandImpl(cmds);
		//batch.setLookup("HelloRulesSession");
		
		String marshalled = marshaller.marshall(batch);
		logger.info(">>> " + marshalled);
	}
	
	@Test
	public void testMarshallStartProcessWithVars() {
		Set<Class<?>> classes = new HashSet<Class<?>>();
		classes.add(Incident.class);
		Marshaller marshaller = MarshallerFactory.getMarshaller(classes,  MarshallingFormat.JSON, CommandMarshallTest.class.getClassLoader());
		
		Incident incident = new Incident();
		incident.setStateCode("VA");
		incident.setBuildingName("building-a");
		incident.setDescription("Programatically creating incident");
		incident.setIncidentType("danger");
		
		StartProcessCommand startCommand = new StartProcessCommand();
		startCommand.setProcessId("processes.report-incident");
		Map<String,Object> parameters = new HashMap<String,Object>();
		parameters.put("incident", incident);
		startCommand.setParameters(parameters);
		
		List<GenericCommand<?>> cmds = new ArrayList<GenericCommand<?>>();
		cmds.add(startCommand);
		
		BatchExecutionCommandImpl batch = new BatchExecutionCommandImpl(cmds);
		
		String marshalled = marshaller.marshall(batch);
		logger.info(">>> " + marshalled);
	}
}
