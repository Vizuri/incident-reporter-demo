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

import com.redhat.vizuri.demo.domain.Answer;
import com.redhat.vizuri.demo.domain.AnswerType;
import com.redhat.vizuri.demo.domain.Incident;
import com.redhat.vizuri.demo.domain.Question;

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
	public void testMarshallGetQuestionnaireForIncident() {
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
	public void testMarshallUpdateQuestionnaire() {
		Set<Class<?>> classes = new HashSet<Class<?>>();
		classes.add(Incident.class);
		Marshaller marshaller = MarshallerFactory.getMarshaller(classes,  MarshallingFormat.JSON, CommandMarshallTest.class.getClassLoader());
		
		List<GenericCommand<?>> cmds = new ArrayList<GenericCommand<?>>();
		InsertObjectCommand insert = new InsertObjectCommand();
		
		Question question = new Question();
		question.setQuestionId("win-1");
		question.setDescription("Is the crack larger than a quarter?");
		question.setQuestionnaireId(1l);
		question.setAnswerType(AnswerType.YES_NO);
		question.setRequired(false);
		question.setEnabled(true);
		question.setOrder(1);
		insert.setObject(question);
		insert.setReturnObject(true);
		insert.setOutIdentifier("question-1");
		cmds.add(insert);
		
		question = new Question();
		question.setQuestionId("win-2");
		question.setDescription("Is the crack larger than a dollar bill?");
		question.setQuestionnaireId(1l);
		question.setAnswerType(AnswerType.YES_NO);
		question.setRequired(false);
		question.setEnabled(false);
		question.setOrder(2);
		insert = new InsertObjectCommand();
		insert.setObject(question);
		insert.setReturnObject(true);
		insert.setOutIdentifier("question-2");
		cmds.add(insert);
		
		question = new Question();
		question.setQuestionId("win-3");
		question.setDescription("Was the car in motion at the time?");
		question.setQuestionnaireId(1l);
		question.setAnswerType(AnswerType.YES_NO);
		question.setRequired(false);
		question.setEnabled(true);
		question.setOrder(3);
		insert = new InsertObjectCommand();
		insert.setObject(question);
		insert.setReturnObject(true);
		insert.setOutIdentifier("question-3");
		cmds.add(insert);
		
		question = new Question();
		question.setQuestionId("win-4");
		question.setDescription("Does the damage impair the drivers vision?");
		question.setQuestionnaireId(1l);
		question.setAnswerType(AnswerType.YES_NO);
		question.setRequired(false);
		question.setEnabled(true);
		question.setOrder(4);
		insert = new InsertObjectCommand();
		insert.setObject(question);
		insert.setReturnObject(true);
		insert.setOutIdentifier("question-4");
		cmds.add(insert);
		
		
		Answer answer = new Answer();
		answer.setQuestionId("win-1");
		answer.setStrValue("Yes");
		insert = new InsertObjectCommand();
		insert.setObject(answer);
		insert.setReturnObject(false);
		cmds.add(insert);
		
		cmds.add(new AgendaGroupSetFocusCommand("sync-answers"));
		cmds.add(new FireAllRulesCommand("sync-answers-fired"));
		
		BatchExecutionCommandImpl batch = new BatchExecutionCommandImpl(cmds);
		batch.setLookup("summit17-ks");
		
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
