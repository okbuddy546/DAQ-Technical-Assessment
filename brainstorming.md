# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

DBC says that 1076 decimal is the id for ecu wheel speed which 705 in hex. 
DBC also says unsigned and big endian format. 

Task 1 steps required:
    - Open dump file 
    - create output file 
    - Create loop to read each CAN frame
    - Extract id and the data string from CAN frame
    - check if id is 705 hex
    - create function to decode can data    
        - can frame is 64 bits long so use uint64
        - since it's big endian extract from signficant bit and then flip the bits???
        - extract FR and RR 
        - multiply extracted FR and RR by conversion factor
        - return this data
    - write the fr and rr data to 1dp in output
    - repeat until end of dump file 

modules found online to read and write files: 
fstream 
sstream for making string into a stream 

Task 2: 
    list advantages first, then disadvantages, then reasons used in department. 

    Advantages of CAN found online:
        - cheaper, less wiring
        - built-in error detection
        - robust and reliable
        - loseless bitwise arbitration
        - modular
    
    disadvantages:
        - relatively limited data rate
        - no security (not necessarily needed for redback unless...)
    
    reasons used in departments:
        - cost effective
        - less wiring so less complicated
        - high fault tolerence
        - easy to add, modify and remove components cause of high flexibility 
        
    (expand on each. at least 2 sentences)


## Telemetry
    The server is breaking because the CAN is sending an error flag which creates a double parantheses 
    that can't be parsed as an object. So fix by checking if error comes up in recieved msg. 

    approaches for checking battery temp:

    Using a temp array store the timestamps when given temperature is critical and then each time it gets 
    detected all timestamps that aren't within 5 seconds of current timestamp are removed and then if 
    3 or more temperatures are detected, send critical temperature warning.

    Start a timer for five seconds when a critical temperature is detected and when timer ends, 
    if 3 ot more other critical temperatures are detected (incrementing variable), warning is displayed 
    and then the timer is restarted. Inefficient method tho since timestamps are already given anyway. 

    for part 3, the livevalue function can just be manipulated to change colour easily. 

    Customisation options: 
        - adding a chart feature for recorded temps
        - displaying a warning sign when critical temperature is reached
        - using better font
        - having a temperature dial 
        

## Cloud

    Other similar weather station apps online using AWS use MQTT to protocol to communicate from weather station to cloud. 
    The mqtt publisher in this case are the sensors on the station. They send information to a mqtt broker which allows
    information to then be sent to "clients" which in this case should be the ecs service on cloud. The sensors each 
    send values to the relevant MQTT topics which is then sent to the clients. 

    AWS IoT core can be used as the MQTT broker in this case which will allow communication between the weather station 
    to cloud apps. The data is then decoded and extracted through a lambda function. "Lambda functions allow 
    users to run code without requiring you to manage server infrastructure". This can then be given to an app in the ecs cluster
    which then allows for frontend access and then can also be used to store weather data into a database for later analytics. 

    Show the weather system as a part of the cloud infrastructure as a whole and then break down it's componenents in a 
    separate diagram like given examples.

    key info: talk about docker and terraform

    all the services used such as sensor applications, the ui and the ecs service can be put into a docker container.

    aws is the provider for the cloud service so it needs to be put into terraform configuration. All services with required
    dependencies and info can be configured and then when application is deployed, you can change the terraform configuration
    to add later serives and dependencies. 