package com.redhat.vizuri.summit17;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class PushNotification implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private com.redhat.vizuri.summit17.Message pushNotification;

   public PushNotification()
   {
   }

   public com.redhat.vizuri.summit17.Message getPushNotification()
   {
      return this.pushNotification;
   }

   public void setPushNotification(
         com.redhat.vizuri.summit17.Message pushNotification)
   {
      this.pushNotification = pushNotification;
   }

   public PushNotification(com.redhat.vizuri.summit17.Message pushNotification)
   {
      this.pushNotification = pushNotification;
   }

}