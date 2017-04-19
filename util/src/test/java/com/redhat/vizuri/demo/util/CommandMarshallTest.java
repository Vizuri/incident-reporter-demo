package com.redhat.vizuri.demo.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.drools.core.command.impl.GenericCommand;
import org.drools.core.command.runtime.BatchExecutionCommandImpl;
import org.drools.core.command.runtime.rule.FireAllRulesCommand;
import org.drools.core.command.runtime.rule.InsertObjectCommand;
import org.drools.core.command.runtime.rule.QueryCommand;
import org.junit.Test;
import org.kie.server.api.marshalling.Marshaller;
import org.kie.server.api.marshalling.MarshallerFactory;
import org.kie.server.api.marshalling.MarshallingFormat;
import org.openshift.quickstarts.decisionserver.hellorules.Person;

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
}
