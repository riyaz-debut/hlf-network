***Run following command one by one to setup the network***

  

  

  

**Open HLF 1 machine**

  

  

***In HLF 1 machine***

  

*** Clone the hyperledger repo :-

Then

  

****Inside HLF 1 machine go to***

  

  

  

>  **/hlf-volume/hyperledger folder**

  

  

  

using command

  

  

  

`cd /hlf-volume/hyperledger`

  

  

  

and then move to scripts folder with command :-**

  

  

  

`cd scripts`

  

  

  

***Note :- Now every command will be run from this scripts folder.***

  

  

  

## Fabric CA

  

  

***In HLF 1 machine***

  

run

  

  

`./scratch/generate-msp.sh re-generate`

  

  

  

***(Note use this to re-generate network certs). This will clear the old certs.***

  

  

  

This will create fabric ca, register and enroll peers, users etc and created MSP, organizations folder will be created after running this command. (hlf-volume/hyperledger/organizations)

  

  

  

## Create ccp connection files

  

  

***In HLF 1 machine***

run

  

  

`./scratch/ccp-generate.sh`

  

  

  

This will create connection files for respective organizations in organization/peerOrganizations/{org_name}.osqo.com where {org_name} is name of organization

  

  

  

***Note:- This file will be used for running explorer,SDK.***

  

  

  

## Generate Genesis block and channel tx

  

  

***In HLF 1 machine***

  

  

  

Run the following comand in HLF 1 machine

  

  

  

`./scratch/genesis.sh`

  

  

  

*** This will create genesis block and channel tx file

  

  

  

***Note:- system-genesis-file folder will be created (hlf-volume/hyperledger/system-genesis-file ) in HLF 1 Machine***

  

  

  

## Create Peer Base file for HLF 1 Machine

  

  

***In HLF 1 machine***

  

  

  

In HLF 1 machine update IP addresses for nodes of HLF 2 machine by replacing the old IP address entries with new IP addresses in set-peer-base.sh file in /hlf-volume/hyperledger/scripts/set-peer-base.sh file

  

  

  

**To create peer base file for HLF 1 machine nodes:-**

  

  

  

***OPEN*** set-peer-base.sh file located at

  

  

  

**

  

>  **/hlf-volume/hyperledger/scripts/set-peer-base.sh**

  

**

  

  

  

file in HLF 1 machine

  

  

  

*** Change the IP addresses for HLF 2 orgs .i.e. **BROKER and ESP**

  

  

  

**REPLACE** the followings in set-peer-base.sh file :-

  

  

  

- PEER0_BROKER_IP={HLF 2 MACHINE IP}

  

  

- PEER1_BROKER_IP={HLF 2 MACHINE IP}

  

  

- PEER0_ESP_IP={HLF 2 MACHINE IP}

  

  

- PEER1_ESP_IP={HLF 2 MACHINE IP}

  

  

where **{HLF 2 MACHINE IP}** is IP address of HLF 2 machine

  

  

  

> e.g. if IP address of HLF 2 machine is **52.62.183.194** then

>

>

>

>

>  - PEER0_BROKER_IP=52.62.183.194

>

>

>

>  - PEER1_BROKER_IP=52.62.183.194

>

>

>

>  - PEER0_ESP_IP=52.62.183.194

>

>

>

>  - PEER0_ESP_IP=52.62.183.194

  

  

  

**Now to generate peer base file for HLF 1 Machine Run :-**

  

  

  

`./scratch/generate-peer-base.sh hlf1`

  

  

  

where **hlf1** is parameter for HLF 1 instance

  

  

  

*** It will also add IP addresses of HLF 1 orgs and other orgs of other instance i.e. HLF 2 in /etc/hosts file of HLF 1 machine

  

  

  

***Deploy the network containers for orgs. of HLF 1 :-***

  

  

*  **In HLF 1 machine***

  

  

  

*This is for HLF 1 organizations and orderer (osqo,bcp and orderer)*

  

  

  

**From HLF  1 instance run the followings :-**

  

  

  

`./start-org.sh orderer`

  

  

  

`./start-org.sh osqo`

  

  

  

`./start-org.sh bcp`

  

  

  

## Create channel

  

  

***In HLF 1 machine***

  

  

  

**Create channel on HLF 1 machine**

  

  

  

  

` ./scratch/create-channel.sh`

  

  

  

**Create and move zip file to other instances (i.e. to HLF 2 )**

  

  

***In HLF 1 machine***

  

  

  

**Create zip files for folders :-**

  

Run below given command to create zip files in HLF 1 machine

  

  

  

  

`./scratch/zip-data.sh`

  

It wil create zip file named certs.zip for below folders :-

*docker-compose-ca*

  

  

  

*orgranizations*

  

  

  

*system-genesis-file*

  

  

  

*channel-artifacts*

  

at root directory and zip will be created whose path would be

**

  

> /hlf-volume/hyperledger/certs.zip

  

**

  

in HLF 1 machine

  
  
  
  
  

  

  
  
  
  

  

  
  
  
  

  

  
  
  

  

  
  
  

  
  
  

  

  

## Now open the HLF 2 machine

  
*** Clone the hyperledger repo :-

  

***In HLF 2 machine***

  

  

  

*Inside HLF 2 machine go to

  

  

  

>  **/hlf-volume/hyperledger folder**

  

  

  

using command

  

  

  

`cd /hlf-volume/hyperledger`

  

**Copy certs.zip file from HLF 1 root directory .i.e.**

  

>  **/hlf-volume/hyperledger/**

  

folder contained in **HLF 1** machine to **HLF 2** machine root directory i.e.**

  

>  **/hlf-volume/hyperledger/**

  

******

of **HLF 2** machine

  

**Unzip** this zip file inside root directory in HLF 2 machine at

  

>  **/hlf-volume/hyperledger/**

  

i.e. HLF 2 root loaction

  

using command

`unzip -d ./ ./certs.zip`

  

  

  
  

  

  
  
  

  

  

where **./** after **-d** option is path of root folder succeeded by path of each zip file

  

  

  

***IN HLF 2 machine***

  

  

  

In HLF 2 machine update IP addresses for nodes of HLF 1 machine nodes , by replacing the old IP address entries with new in set-peer-base.sh file in /hlf-volume/hyperledger/scripts/set-peer-base.sh file

  

  

  

***OPEN***  **set-peer-base.sh** located at

  

  

  

>  **/hlf-volume/hyperledger/scripts/set-peer-base.sh**

  

  

  
  
  

  

  

**To create peer base file for hlf 2 nodes :-**

  

  

  

change the IP addresses for HLF 1 orgs .i.e. **OSQO , BCP & ORDERER**

  

  

  

**REPLACE** the followings :-

  

  

  

- PEER0_OSQO_IP={HLF 1 MACHINE IP}

  

  

- PEER1_OSQO_IP={HLF 1 MACHINE IP}

  

  

- PEER0_BCP_IP={HLF 1 MACHINE IP}

  

  

- PEER1_BCP_IP={HLF 1 MACHINE IP}

  

  

- ORDERER_IP={HLF 1 MACHINE IP}

  

  

where **{HLF 1 MACHINE IP}** is IP address of HLF 1

  

  

  

> e.g. if IP address of HLF 1 machine is **13.210.137.148** then

>

>

>

>

>  - PEER0_OSQO_IP=13.210.137.148

>

>

>

>  - PEER1_OSQO_IP=13.210.137.148

>

>

>

>

>  - PEER0_BCP_IP=13.210.137.148

>

>

>

>

>  - PEER1_BCP_IP=13.210.137.148

>

>

>

>

>  - ORDERER_IP=13.210.137.148

  

  

  

***Move to scripts folder in HLF 2 machine***

  

  

  

`cd scripts`

  

  

  

Then run :-

  

  

  

`./scratch/generate-peer-base.sh hlf2`

  

  

  

where **hlf2** is parameter for HLF 2 instance machine

  

  

  

It will add IP addresses of HLF 2 orgs and other orgs of other instance i.e. HLF 1 in /etc/hosts file of HLF 2

  

  

  

***Deploy the network containers for orgs of HLF 2 :-***

  

  

*  **In HLF 2 machine***

  

  

  

To run HLF 2 organizations (broker and esp) :-

  

  

  

From **scripts** folder in HLF 2 machine Run following commands:-

  

  

  

`./start-org.sh broker`

  

  

  

`./start-org.sh esp`

  

  

  

## AGAIN MOVE TO HLF 1 MACHINE

  

  

***Note :- If not in scripts folder then move to scripts folder first from***

  

  

  

>  **/hlf-volume/hyperledger/**

  

  

  

**HLF 1 machine using command:-**

  

  

`cd scripts`

  

  

  

## Join channel in HLF 1

  

  

***In HLF 1 machine***

  

  

  

Now join peers of Osqo and Bcp to already created channel and also set and update anchor peers for organizations.

  

  

  

From scripts folders run below given commands

  

  

  

**If already in scripts folder then run :-**

  

  

  

`./scratch/join-channel-org.sh osqo`

  

  

  

`./scratch/join-channel-org.sh bcp`

  

  

  

***NOTE:- Before moving forward to  join channel for HLF 2 , make sure we have added HLF 2 IP entry in HLF 1 machine security groups (Inbounds)***

  

  

  

## AGAIN MOVE TO HLF 2 MACHINE

  

  

***Note :- If not in scripts folder then move to scripts folder first from***

  

  

  

>  **/hlf-volume/hyperledger/**

  

  

  

HLF 1 machine using command:-

  

  

`cd scripts`

  

  

  

## Join channel in HLF 2

  

  

**Open** HLF 2 machine

  

  

  

Now join peers of broker and esp to already created channel and also set and update anchor peers for organizations.

  

  

  

***From scripts folders run below given commands***

  
  
  

  

`./scratch/join-channel-org.sh broker`

  

  

  

`./scratch/join-channel-org.sh esp`

  

  

  

## Install chaincode on HLF 2 Organizations

  

  

***In HLF 2 machine***

  

  

  

*** This will deploy the chaincode on esp and broker organizations of HLF 2 machine.

  

  

  

**ESP**

  

  

***Install chaincode for ESP by following command:-***

  

  

  

`./chaincode/install-chaincode.sh esp osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode 1.0 1`

  

  

  

**Parameters here are :-**

  

  

**esp** is name of organization (1st parameter)

  

  

  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**1.0** is the version of chaincode (4th parameter)

  

  

  

**1** is the sequence of chaincode (5th parameter)

  

  

  

**BROKER**

  

  

**Install chaincode for BROKER by following command:-**

  

  

  

`./chaincode/install-chaincode.sh broker osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode 1.0 1`

  

  

  

*****Parameters here are :-**

  

  

  

**broker** is name of organization (1st parameter)

  

  

  
  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**1.0** is the version of chaincode (4th parameter)

  

  

  

**1** is the sequence of chaincode (5th parameter)

  

  

  

## AGAIN MOVE TO HLF 1 MACHINE

  

  

***Note :- If not in scripts folder then move to scripts folder first***

  

  

  

>  **/hlf-volume/hyperledger/scripts**

  

  

  

in HLF 1 machine using command:-

  

  

`cd scripts`

  

  

  

## Install chaincode on HLF 1 Organizations

  

  

***In HLF 1 machine***

  

  

  

This will deploy the chaincode on osqo and bcp organizations.

  

  

  

**OSQO**

  

  

**Install chaincode for OSQO by following command:-**

  

  

  

`./chaincode/install-chaincode.sh osqo osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode 1.0 1`

  

  

  

*****Parameters here are :-**

  

  

  

**osqo** is name of organization (1st parameter)

  

  

  
  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**1.0** is the version of chaincode (4th parameter)

  

  

  

**1** is the sequence of chaincode (5th parameter)

  

  

  

**BCP**

  

  

**Install chaincode for BCP by following command:-**

  

  

  

`./chaincode/install-chaincode.sh bcp osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode 1.0 1`

  

  

  

*****Parameters here are :-**

  

  

  

**bcp** is name of organization (1st parameter)

  

  

  
  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**1.0** is the version of chaincode (4th parameter)

  

  

  

**1** is the sequence of chaincode (5th parameter)

  

  

  

## Commit chaincode

  

  

***In HLF 1 machine***

  

  

  

** This will commit the chaincode after every organization in network has approved the chaincode.

  

  

  

**In HLF 1 machine from scripts folder run command:-**

  

  

`./chaincode/commit-chaincode.sh osqo osqo-chaincode 1.0 1`

  

  

  

*****Parameters here are :-**

  

  

  

**osqo** is name of organization (1st parameter)

  

  

  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**1.0** is the version of chaincode (3rd parameter)

  

  

  

**1** is the sequence number of chaincode (5th parameter)

  

  

  


  

  

  

## Start Explorer

  

  

## Move To HLF 1 machine

  

  

***From scripts folder run docker explorer in HLF 1 machine using command :-***

  

  

  

`./scratch/start-explorer.sh`

  

  

  

***Note:- Open http port in HLF 1 instance with port range 80***

  

  

  

Hit the url http://**{HLF_1_IP}**:80/

  

  

where **{HLF_1_IP}** is IP address of HLF 1 machine

  

  

  

## Setup SDK

  

  

***In HLF 1 machine***

  

  

This will be used to interact with installed chaincode on network. It provides apis to submit transactions to ledger or query contents of ledger.

  

  

  

*****Clone the hyperledger-sdk repo in hlf-volume/**

  

  

***in HLF 1 machine***

  

  

  

***NOTE:- Add custom port 3000 in security groups inn HLF 1 Instance***

  

  

  

*****First move to sdk root folder**

  

  

  

`cd /hlf-volume/hyperledger-sdk`

  

  

  

**From hyperledger-sdk root folder and run command inside terminal :-**

  

  

  

`./sdk-start.sh`

  

  

  

***NOTE:-Import osqo postman collection from /hlf-volume/hyperledger-sdk/OSQO Basic Chaincode.postman_collection.json into postman***

  

  

  

If you want to **run sdk on local** , run following commands :-

  

  

  

***Move to the path where app.js file is located and open terminal there

  

  

  

`npm install`

  

  

  

This will install all node packages and dependencies required to run node sdk application.

  

  

  

run the sdk app through command :-

  

  

  

`npm start`

  ## SETUP COMPLETED FOR HLF 1 and HLF 2 machines.
  
  
  


##  RESTART DOCKER CONTAINERS AUTOMATICALLY IN CASE OF RESTARTING MACHINE

**If you want all running docker containers to restart automatically in case of machine restart , do the followings :-
After setting up the  whole network , installing chaincode, setting up sdk , setting up explorer run the following command on every machine :-**

(Before running this command all required containers should be in running state).

`docker update --restart unless-stopped $(docker ps -q)`

**Note:-**   Run this command as last step on every machine so that whichever machine restart's, docker containers starts automatically.






## BELOW ARE THE INSTRUCTIONS TO BE FOLLOWED IN CASE OF MACHINE RESTART


## MOUNT ADDITIONAL VOLUME IN CASE OF HLF MACHINE SYSTEM CRASH/RESTART 


**Note:-** Instructions are same for every machine in case of restarted machine

*****Login to the machine which is restarted and run the following command :-** 

`cd /`

*****Now move to  etc folder by running command :-** 
 
 `cd etc`

*** Create a backup of a filename  `fstab`   that you can use if you accidentally destroy or delete this file while editing it.:-

`cp fstab fstab.orig`


**Use below command to find the UUID of the additional volume. :-

`sudo blkid`

**NOTE:-** Make a note of the UUID of the additional volume that you want to mount after reboot.

e.g. output of blkid would provide an entry of addtional volume along with other entries .
**In our case addtional volume UUID entry look like :-** 

/dev/xvdb: UUID="c19a39c8-74ca-42ff-bfe3-3538a4afd8b7"    BLOCK_SIZE="512" TYPE="xfs"


where **/dev/xvdb** is our additional volume (volume name be of some different name than this . Check carefully ).



**Now open the `/etc/fstab` file using any text editor, such as** **nano**  using command :- **

`sudo nano fstab`


**Add the above entry (/dev/xvdb: UUID="c19a39c8-74ca-42ff-bfe3-3538a4afd8b7"    BLOCK_SIZE="512" TYPE="xfs") to `/etc/fstab` file  to mount the device at the specified mount point.:-**

Entry would be like :-

`UUID=c19a39c8-74ca-42ff-bfe3-3538a4afd8b7  /hlf-volume  xfs  defaults,nofail  0  2`

In our case, we mount the volume with UUID `c19a39c8-74ca-42ff-bfe3-3538a4afd8b7` to mount point `/hlf-volume` and we use the `xfs` file system. We also use the `defaults` and `nofail` flags. We specify `0` to prevent the file system from being dumped, and we specify `2` to indicate that it is a non-root device.


**To verify that your entry works, run the following commands to unmount the device and then mount all file systems in `/etc/fstab`.** 
**If there are no errors, the `/etc/fstab` file is OK and your file system will mount automatically after it is rebooted.**

`sudo umount /hlf-volume`

`sudo mount -a`


**If you are unsure how to correct errors in `/etc/fstab` and you created a backup file in the first step of this procedure, you can restore from your backup file using the following command from **etc folder** :-.**

`sudo mv fstab.orig fstab`



   

## NOW RESTART DOCKER CONTAINERS ON RESTARTING MACHINE (Only in case docker containers do not start automatically)


**After mounting additional volume , logged in to the machine again which is restarted, go to hlf-volume folder using commands from root :-**

`cd /`

`cd /hlf-volume`

 **After moving to hlf-volume folder run following commands to restart the containers:-**

`docker start $(docker ps -aq)`

 **To check now whether docker containers are running or not , run following command :- **
 
`docker ps -a`

**If it will display all containers status as Up then  containers are running well and ,
if status is exited then container is in not running state


***ENDS HERE




## RUN BELOW COMMANDS in HLF 3 Machine (IF NEW ORGANIZATION is added)

  


*** FOR HLF 3 *** (Only use this if new organization is added)

  

***To create peer base file for hlf 3 nodes :-***

  

  

change the IP addresses for HLF 1 and HLF 2 orgs .i.e. **OSQO , BCP ,ORDERER, BROKER and ESP**

  

  

**REPLACE** the followings :-

  

  

>  - PEER0_OSQO_IP={HLF 1 MACHINE IP}

>

>  - PEER1_OSQO_IP={HLF 1 MACHINE IP}

>

>  - PEER0_BCP_IP={HLF 1 MACHINE IP}

>

>

>  - PEER1_BCP_IP={HLF 1 MACHINE IP}

>

>  - ORDERER_IP={HLF 1 MACHINE IP}

>

>

>  - PEER0_BROKER_IP={HLF 2 MACHINE IP}

>

>  - PEER1_BROKER_IP={HLF 2 MACHINE IP}

>

>  - PEER0_ESP_IP={HLF 2 MACHINE IP}

>

>  - PEER1_ESP_IP={HLF 2 MACHINE IP}

  

where **{HLF 1 MACHINE IP}**,**{HLF 2 MACHINE IP}** are IP address of HLF 1 and HLF 2 machines e.g. **13.210.137.148** , **52.62.183.194**

  

e.g. if IP address of HLF 1 machine is **13.210.137.148** then

  

  

>  **PEER0_OSQO_IP=13.210.137.148**

  

  

and if IP address of HLF 2 machine is **52.62.183.194** then

  

  

>  **PEER0_BROKER_IP=52.62.183.194**

  

  

**Run following coammand (Only if new organization is added) :-**

  

  

`./scratch/generate-peer-base.sh hlf3`

  

  

where **hlf3** is parameter for HLF 3 instance

  

  

It will add IP addresses of HLF 3 orgs and other orgs of other instance i.e. HLF 1 and HLF 2 in /etc/hosts file of HLF 3 machine





***NOTE :- WE CAN SKIP THE BELOW STEPS AS WE CAN QUERY/INVOKE CHAINCODE WITH SDK. SO We CAN DIRECTLY MOVE TO START EXPLORER AND START SDK  SECTION OF THIS FILE***

  

  

  

## QUERY/INVOKE Chaincode

  

  

This will be used to perform create,read,delete etc operations on chaincode installed chaincode.

  

  

  

`./chaincode/invoke-query.sh osqo`

  

  

  

***To update the chaincode. Edit the install chaincode command above ***

  

  

  

Increment the sequence number parameter e.g.increasing **sequence** number to 2 (if previous was 1)

  

  

  

**Like for osqo:-**

  

  

  

`./chaincode/install-chaincode.sh osqo osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode 1.0 2`

  

  

  

*****Parameters here are :-**

  

  

**osqo** is name of organization (1st parameter)

  

  

  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**1.0** is the version of chaincode (4th parameter)

  

  

  

**2** is the incremented sequence number (if previous was 1) of chaincode (5th parameter)

  

  

  

***Note :- Do this for every organization through install chaincode command of every organization***

  

  

  

and then run chaincode-commmit command with **new sequence number** e.g. for sequence number 2:-

  

  

  

`./chaincode/commit-chaincode.sh osqo osqo-chaincode 1.0 2`

  

  

  

***To upgrade the chaincode. Edit the install chaincode command above ***

  

  

  

Increment the version number parameter e.g.increasing **version** number to 2.0 (if previous was 1.0)

  

  

  

**Like for osqo:-**

  

  

  

`./chaincode/install-chaincode.sh osqo osqo-chaincode /hlf-volume/hyperledger-sdk/osqo-chaincode/osqo-chaincode 2.0 1`

  

  

  

*******Parameters here are :-****

  

  

  

**osqo** is name of organization (1st parameter)

  

  

  

**osqo-chaincode** is name of chaincode (2nd parameter)

  

  

  

**/hlf-volume/hyperledger-sdk/osqo-chaincode/osqo-chaincode** is path of chaincode (3rd parameter) where {hlf-volume} is other location where chaincode is located.

  

  

  

**2.0** is the version of chaincode (4th parameter)

  

  

  

**1** is the incremented sequence number of chaincode (5th parameter)

  

  

  

***NOTE :- Do this for every organization through install chaincode command of every organization***

  

  

and then run chaincode-commmit command with **new version number** e…g for sequence number 2:-

  

  

  

`./chaincode/commit-chaincode.sh osqo osqo-chaincode 2.0 1`
