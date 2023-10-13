./scratch/generate-msp.sh re-generate

sleep 2

./scratch/ccp-generate.sh

sleep 2

./scratch/genesis.sh

sleep 2

echo "================================= UP PEERS FILE =================================="

./start-org.sh orderer

sleep 2

./start-org.sh org1

sleep 2

./start-org.sh org2

sleep 2



echo "================================= CREATE CHANNEL =================================="

./scratch/create-channel.sh

sleep 2

echo "================================= JOIN PEERS TO CHANNEL =================================="


./scratch/join-channel-org.sh org1

sleep 2

./scratch/join-channel-org.sh org2

# # ================================= CHAINCODE LIFECYCLE COMMANDS ===========================================
# # NOTE: Place your chaincode folder in the hyperledger network folder and then use this chaincode path ../signature-cc otherwise change the cc path according to your folder structure

# echo "================================= INSTALL CC ON ORGS =================================="

# ./chaincode/install-chaincode.sh org1 org1-chaincode ../signature-cc 1.0 1

# sleep 2

# ./chaincode/install-chaincode.sh org1 org1-chaincode ../signature-cc 1.0 1

# sleep 2

# echo "================================= COMMIT CHAINCODE =================================="

# ./chaincode/commit-chaincode.sh org1 org1-chaincode 1.0 1
