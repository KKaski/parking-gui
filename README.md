# Parking Demo User Interface (parking-gui)
---

This is demo application using IBM Bluemix and Meteor framework to create responsive IoT application. It uses Node-Red based microservices to connect to the physical world. 

This project is the user interface layer for the end users. 

**To push this application Bluemix navigate to the main folder and type**  
*cf push parking-gui -b https://github.com/cloudfoundry-community/cf-meteor-buildpack.git --no-start*  

**Add Mongo service to the project using the following command**  
*cf create-service mongodb 100 parking-mongodb*  

**Bind Teh mongo serivces to the gui**  
*cf bind-service parking-gui parking-mongodb*  

**Start the GUI**  
*cf start parking-gui*  

###### H6 Note! Use your own application name to avoid overlapping hostnames in public Bluemix environment
