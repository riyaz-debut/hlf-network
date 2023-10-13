## Network Architecture OSQO HLF  
  

We have five peer organizations and one ordering org in this network. All of the orgs are deployed on AWS.
####  Peer organizations
 - OSQO 
 - BCP 
 - ESP 
 - Broker 
 - Oregon (fifth org)

#### Orderer organizations
 - OrdererOrg

#### AWS Servers
We have three instances hosting the all of above mentioned orgs.

 
| Instance | Private IP |	Public IP|	Region|
|--|--|--|--|
| HLF 1 | 172.31.16.218 |	13.210.137.148 | Sydeny
| HLF 2 | 172.31.19.35 |	52.62.183.194  | Sydeny
| HLF 3 | 172.31.7.88   |	34.208.86.43   | Oregon

HLF 1 nodes

orderer.osqo.com
orderer1.osqo.com
orderer2.osqo.com
orderer3.osqo.com
orderer4.osqo.com
orderer5.osqo.com
peer0.bcp.osqo.com
peer1.bcp.osqo.com
peer0.osqo.osqo.com
peer1.osqo.osqo.com

#HLF 2 orgs

peer0.broker.osqo.com
peer1.broker.osqo.com
peer0.esp.osqo.com
peer1.esp.osqo.com


##### hosts entries

##### HLF 1 nodes (osqo bcp)
13.210.137.148   orderer.osqo.com
13.210.137.148   orderer1.osqo.com
13.210.137.148   orderer2.osqo.com
13.210.137.148   orderer3.osqo.com
13.210.137.148   orderer4.osqo.com
13.210.137.148   orderer5.osqo.com
13.210.137.148   peer0.bcp.osqo.com
13.210.137.148   peer1.bcp.osqo.com
13.210.137.148   peer0.osqo.osqo.com
13.210.137.148   peer1.osqo.osqo.com  

##### HLF 2 nodes (esp broker)
52.62.183.194   peer0.broker.osqo.com
52.62.183.194   peer1.broker.osqo.com
52.62.183.194   peer0.esp.osqo.com    
52.62.183.194   peer1.esp.osqo.com

##### HLF 3 nodes (oregon org)
34.208.86.43   peer0.oregon
34.208.86.43   peer1.oregon


** Replace IP with localhost address on local hosted services for eg. replace ip for peer0.osqo.osqo.com with 127.0.0.1 on HLF 1 machine**
