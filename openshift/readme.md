Original s2i assets from:

Decision Server 6.3 basic
https://github.com/jboss-openshift/application-templates/blob/master/decisionserver/decisionserver63-basic-s2i.json

Process Server 6.3 Basic, Postgres
https://github.com/jboss-openshift/application-templates/blob/master/processserver/processserver63-postgresql-persistent-s2i.json

JBoss Image Streams
https://github.com/jboss-openshift/application-templates/blob/master/jboss-image-streams.json


Setup steps

oc create -f jboss-image-streams.json
oc create -f decisionserver63-basic-s2i.json


Spring Boot

Using the jboss-eap64-openshift s2i
