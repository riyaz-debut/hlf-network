'use strict';

require('dotenv').config();
const config = require('../config');


console.log("enetr===",config)
console.log("enetr===",config.node_env)
const { Contract } = require('fabric-contract-api');
const error = require('./errors.js');
const shim = require('fabric-shim');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const logger = shim.newLogger('prototype-tb');
const { ENROLLMENT_ID_ATTRIBUTE, ROLE_ATTRIBUTE, CUSTOMER_ROLE, TOKEN_TYPE, IDENTITY_FEE, TOKEN_ACTIONS, TOKEN_ACTIONS_ENUM, TOKEN_ISSUE_STATUS, TOKEN_HISTORY_DOC_TYPE, ENCRYPTION_ALGO, TOKEN_ISSUE_TX_STATUS } = require('./constants');
const helper = require('./helper');
const crypto = require('crypto');

class Identity extends Contract {

    /**
     * Init the Ledger
     * @param {*} ctx 
     */
    async initLedger(ctx) {
        logger.info(`Initialize Ledger`);
    }

    /**
     * Query the Identity by ID
     * @param {*} ctx 
     * @param {*} data
     * @returns 
     */
    async queryIdentity(ctx, data) {
        data = JSON.parse(data);
        const assetJSON = await ctx.stub.getState(data.id);
        if (!assetJSON || assetJSON.length === 0) {
            return [];
        }
        return assetJSON.toString();
    }

    /**
     * Create the Identity
     * @param {*} ctx 
     * @param {*} data
     * @returns 
     */
    async createIdentity(ctx, data) {
        let identity = JSON.parse(data)
        let identityObj = {
            '$class': identity['$class'],
            integraId: identity.integraId,
            recordId: identity.recordId,
            identityType: identity.identityType,
            metaData: identity.metaData,
            opt1: identity.opt1,
            opt2: identity.opt2,
            opt3: identity.opt3,
            transactionId: ctx.stub.getTxID(),
            creationDate: identity.creationDate,
            integraPublicKeyId: identity.integraPublicKeyId || "",
            // signedvalue: identity.signedvalue,
            value: identity.value
        };

        if (identity.integraPublicKeyId == "" || !identity.integraPublicKeyId) {
            await ctx.stub.putState(identity.integraId, Buffer.from(JSON.stringify(identityObj)));
            return identityObj;
        } else {
            const identityAsBytes = await ctx.stub.getState(identity.integraPublicKeyId);
            if (!identityAsBytes || identityAsBytes.length === 0) {
                return { status: 400, message: "Invalid integra public key!" }
                // throw new error.InvalidPublicKey();
            }
            let userRecord = JSON.parse(identityAsBytes.toString())
            // validate signature
            var checkSignedvalue = await this.verifySignatures(userRecord.keyValue, identity.signedvalue, identity.value, ENCRYPTION_ALGO)
            if (checkSignedvalue == 1) {
                //Validate token amount
                let availableTokenAmount = parseInt(userRecord.tokenAmount);
                if(config.node_env != "test"){
                if (!availableTokenAmount || availableTokenAmount < IDENTITY_FEE) {
                    return { status: 400, message: "Insufficient token amount, please add tokens!" }
                    // throw new error.InSufficientTokenAmount();
                }
            }
                await ctx.stub.putState(identity.integraId, Buffer.from(JSON.stringify(identityObj)));
                if (availableTokenAmount!=0 || availableTokenAmount >= IDENTITY_FEE) {
                await this.debitTokens(ctx, userRecord, identity.integraId, IDENTITY_FEE, identity.creationDate);
                }
                return identityObj;
            } else {
                return { status: 400, message: "Signature not matched please verify it again!" }
                // throw new error.InvalidSignature();
            }
        }
    }

    /**
     * Debit Tokens
     * @param {*} ctx 
     * @param {*} integraPublicKeyId string
     * @param {*} amount number 
     * @returns 
     */
    async debitTokens(ctx, userRecord, refTxId, amount, creationDate = null) {
         let newTokenAmount = parseInt(userRecord.tokenAmount) - amount;
        let record = {
            transactionId: userRecord.transactionId,
            $class: userRecord.$class,
            integraId: userRecord.integraId,
            keyValue: userRecord.keyValue,
            tokenAmount: newTokenAmount,
            creationDate: creationDate,
        };
        await ctx.stub.putState(userRecord.integraId, Buffer.from(JSON.stringify(record)));
        await this.createTokenHistory(ctx, userRecord.integraId, refTxId, amount, TOKEN_ACTIONS_ENUM.DEBIT, creationDate, TOKEN_ISSUE_TX_STATUS.NORMAL);
        return true;
    }

    /**
     * Creates token spend history
     * @param {*} ctx
     * @param {*} integraId string
     * @param {*} action boolean (true|false)
     * @param {*} action number (0|1)
     * @returns
     */
    async createTokenHistory(ctx, integraId, refTxId = null, amount, action = 0, creationDate = null, txStatus) {
        let record = {
            refTxId: refTxId,
            action: TOKEN_ACTIONS[action],
            identityId: integraId,
            amount: amount,
            docType: TOKEN_HISTORY_DOC_TYPE,
            creationDate: creationDate,
            txStatus: txStatus
        }
        const txId = ctx.stub.getTxID();
        await ctx.stub.putState(txId, Buffer.from(JSON.stringify(record)));
        return txId;
    }

    /**
     * Adds a Owner Public Key
     * @param {*} ctx
     * @param {*} data
     * @returns
     */
    async registerKey(ctx, data) {
        data = JSON.parse(data);
        const identityAsBytes = await ctx.stub.getState(data.integraId);
        if (identityAsBytes && identityAsBytes.length !== 0) {
            return { status: 400, message: "Owner ID has been taken!" }
            // throw new error.OwnerExists();
        }

        let record = {
            transactionId: ctx.stub.getTxID(),
            $class: data['$class'],
            integraId: data.integraId,
            keyValue: data.keyValue,
            tokenAmount: data.tokenAmount,
            creationDate: data.creationDate,
        }

        await ctx.stub.putState(data.integraId, Buffer.from(JSON.stringify(record)));
        return data;
    }

    /**
     * Query the Identity records
     * @param {*} ctx
     * @param {*} data
     * @returns
     */
    async queryIdentityByValue(ctx, data) {
        data = JSON.parse(data);
        let results = await helper.QueryIdentityByField(ctx, data.key, data.value);
        logger.info(`Query results: ${JSON.stringify(results)}`);
        return results;
    }

    /**
     * Query the Identity records via field and sort
     * @param {*} ctx
     * @param {*} data
     * @returns
     */
    async queryIdentityByValueandSort(ctx, data) {
        data = JSON.parse(data);
        let results = await helper.QueryIdentityByFieldSort(ctx, data.key, data.value);
        logger.info(`Query results: ${JSON.stringify(results)}`);
        return results;
    }

    /**
    * Query the top holders
    * @param {*} ctx
    * @param {*} data
    * @returns
    */
    async topHolders(ctx, data) {
        data = JSON.parse(data);
        let results = await helper.QueryTopHolders(ctx, data.limit);
        logger.info(`Query results: ${JSON.stringify(results)}`);
        return results;
    }

    /**
     * Query the Key for Owner
     * @param {*} ctx
     * @param {*} data
     * @returns
     */
    async queryKeyForOwner(ctx, data) {
        data = JSON.parse(data);
        let results = await helper.QueryKeyByIntegraId(ctx, data.id);
        logger.info(`Query results: ${JSON.stringify(results)}`);
        return results;
    }

    /**
     * Get the Owner history
     * @param {*} ctx
     * @param {*} data
     * @returns
     */
    async getHistoryForOwner(ctx, data) {
        data = JSON.parse(data);
        const identityAsBytes = await ctx.stub.getState(data.integraId);
        if (!identityAsBytes || identityAsBytes.length === 0) {
            return { status: 404, message: "Owner ID does not exists!" }
            // throw new error.OwnerDoesNotExists();
        }

        const history = await ctx.stub.getHistoryForKey(data.integraId);
        const allResults = [];

        while (true) {
            const historychild = await history.next();
            if (historychild.value && historychild.value.value.toString()) {
                let Record;
                try {
                    Record = JSON.parse(historychild.value.value.toString('utf8'));
                } catch (err) {
                    Record = historychild.value.value.toString('utf8');
                }
                allResults.push({ Record });
            }

            if (historychild.done) {
                await history.close();
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     * List all tokens for a customer
     * The tokens returned depend on the identity of the caller
     *
     * @async
     * @param {Context} ctx context
     * @param {*} customerId id of the customer
     * @returns {Promise<Object[]>} a list of tokens
     */
    // async ListTokens(ctx, customerId) {
    //     // check role
    //     const role = ctx.clientIdentity.getAttributeValue(ROLE_ATTRIBUTE);
    //     const userId = ctx.clientIdentity.getAttributeValue(ENROLLMENT_ID_ATTRIBUTE);

    //     if (role === CUSTOMER_ROLE && customerId !== userId) {
    //         throw new Error('You are not allowed to access the tokens of other customers');
    //     }
    //     logger.info(`Listing tokens for user: ${userId}`);

    //     let tokens = await helper.QueryTokensByCustomer(ctx, customerId);

    //     logger.info(`Returning tokens: ${JSON.stringify(tokens)}`);
    //     return tokens;
    // }

    /**
     * Return a specific token
     *
     * @async
     * @param {Context} ctx context
     * @param {*} id the id of the token to return
     * @returns {Promise<Object>} a token
     */
    // async GetToken(ctx, id) {

    //     // check role
    //     const role = ctx.clientIdentity.getAttributeValue(ROLE_ATTRIBUTE);
    //     const userId = ctx.clientIdentity.getAttributeValue(ENROLLMENT_ID_ATTRIBUTE);

    //     // get token
    //     let token = await helper.ReadAsset(ctx, id);

    //     // security checks
    //     // customers can only see their tokens
    //     if (role === CUSTOMER_ROLE && token.Customer !== userId) {
    //         throw new Error('You are not allowed to access the tokens of other customers');
    //     }

    //     return token;
    // }

    /**
      * Add/Issue Tokens
      * @param {*} ctx 
      * @param {*} integraPublicKeyId string
      * @param {*} amount number 
      * @returns 
      */
    async addTokens(ctx, data) {

        let cid = new ClientIdentity(ctx.stub);
        if (cid.getMSPID() !== 'IntegraMSP') {
            return { status: 401, message: "Unauthorized" }
        }

        let identity = JSON.parse(data)
        if (!identity.integraId) {
            return { status: 404, message: "Identity does not exists!" }
            // throw new error.IdentityNotFound
        }

        const identityAsBytes = await ctx.stub.getState(identity.integraId);
        if (!identityAsBytes || identityAsBytes.length === 0) {
            return { status: 400, message: "Invalid integra public key!" }
            // throw new error.InvalidPublicKey();
        }

        let userRecord = JSON.parse(identityAsBytes.toString());

        //Issue token 
        if (identity.issue) {
            const issueResponse = await this.issueToken(ctx, identity);
            return issueResponse;
        }

        //Calculate token amount
        let newTokenAmount = (parseInt(userRecord.tokenAmount) || 0) + identity.amount;

        //Create final object
        // userRecord.tokenAmount = newTokenAmount;
        // let newUserObject = Object.assign(userRecord, { tokenAmount: newTokenAmount });
        let newRecord = {
            transactionId: userRecord.transactionId,
            $class: userRecord['$class'],
            integraId: userRecord.integraId,
            keyValue: userRecord.keyValue,
            tokenAmount: newTokenAmount,
            creationDate: userRecord.creationDate,
        };

        //Update state
        await ctx.stub.putState(userRecord.integraId, Buffer.from(JSON.stringify(newRecord)));

        //create token history
        await this.createTokenHistory(ctx, newRecord.integraId, null, identity.amount, TOKEN_ACTIONS_ENUM.CREDIT, identity.creationDate, TOKEN_ISSUE_TX_STATUS.NORMAL);

        let result = {
            "status": 200,
            "message": "Tokens has been added successfully!",
            "data": newRecord
        };
        return result;
    }

    /**
    * redeemIssue - Method to redeem issue token txn
    * @param {*} ctx 
    * @param {*} data 
    * @returns 
    */

    async redeemIssueToken(ctx, data) {

        let payload = JSON.parse(data)

        if (!payload.issueTxnId) {
            return { status: 404, message: "Issue Txn Id is missing!" }
        }

        const issueTxAsBytes = await ctx.stub.getState(payload.issueTxnId);
        if (!issueTxAsBytes || issueTxAsBytes.length === 0) {
            return { status: 400, message: "Invalid issue txn id" }
        }

        //Issue txn data
        let issueTxnData = JSON.parse(issueTxAsBytes.toString());

        //integra identity id
        const identityAsBytes = await ctx.stub.getState(issueTxnData.identityId);

        if (!identityAsBytes || identityAsBytes.length === 0) {
            return { status: 400, message: "Invalid integra id" }
        }

        let userRecord = JSON.parse(identityAsBytes.toString());

        //Issue token status verify
        if (issueTxnData.txStatus !== TOKEN_ISSUE_TX_STATUS.PENDING) {
            return { status: 400, message: "Invalid issue txn id or already redeemed" }
        }

        //Calculate token amount
        let newTokenAmount = (parseInt(userRecord.tokenAmount) || 0) + issueTxnData.amount;

        //Create final object
        // userRecord.tokenAmount = newTokenAmount;
        // let newUserObject = Object.assign(userRecord, { tokenAmount: newTokenAmount });
        let newRecord = {
            transactionId: userRecord.transactionId,
            $class: userRecord['$class'],
            integraId: userRecord.integraId,
            keyValue: userRecord.keyValue,
            tokenAmount: newTokenAmount,
            creationDate: userRecord.creationDate,
        };

        //Update registry record
        await ctx.stub.putState(userRecord.integraId, Buffer.from(JSON.stringify(newRecord)));


        //Update txn history 
        let txnHistoryRecord = {
            refTxId: issueTxnData.refTxId,
            action: issueTxnData.action,
            identityId: issueTxnData.identityId,
            amount: issueTxnData.amount,
            docType: issueTxnData.docType,
            creationDate: issueTxnData.creationDate,
            txStatus: TOKEN_ISSUE_TX_STATUS.REDEEMED
        }

        await ctx.stub.putState(payload.issueTxnId, Buffer.from(JSON.stringify(txnHistoryRecord)));

        //create token history
        await this.createTokenHistory(ctx, newRecord.integraId, payload.issueTxnId, txnHistoryRecord.amount, TOKEN_ACTIONS_ENUM.ISSUED_REDEEMED, payload.creationDate, TOKEN_ISSUE_TX_STATUS.NORMAL);

        let result = {
            "status": 200,
            "message": "Issue has been redeemed successfully!",
            "data": newRecord
        };
        return result;
    }

    /**
     * issueToken - Method to create issue token txn
     * @param {*} ctx 
     * @param {*} data 
     * @returns 
     */

    async issueToken(ctx, identity) {

        //create token history for issue
        const txId = await this.createTokenHistory(ctx, identity.integraId, null, identity.amount, TOKEN_ACTIONS_ENUM.ISSUED, identity.creationDate, TOKEN_ISSUE_TX_STATUS.PENDING);
        return {
            status: 200,
            message: 'Token issued',
            data: {
                issueTxnId: txId,
                amount: identity.amount,
                integraId: identity.integraId
            }
        }
    }
    /**
     * update tokens (new purchase)
     *
     * @async
     * @param {Context} ctx context
     * @param {*} id token id
     * @param {*} amount token amount to add
     */
    // async UpdateToken(ctx, id, amount) {

    //     // check role
    //     const role = ctx.clientIdentity.getAttributeValue(ROLE_ATTRIBUTE);
    //     const userId = ctx.clientIdentity.getAttributeValue(ENROLLMENT_ID_ATTRIBUTE);
    //     if (role !== CUSTOMER_ROLE) {
    //         throw new Error('Only customers can edit tokens');
    //     }

    //     // get current token
    //     let token = await helper.ReadAsset(ctx, id);

    //     // check if user is teaching the course
    //     if (course.Customer !== userId) {
    //         throw new Error('You are only allowed to edit tokens of yourself');
    //     }

    //     // update token
    //     let updatedToken = {
    //         ID: id,
    //         docType: TOKEN_TYPE,
    //         Customer: token.Customer,
    //         Amount: token.Amount + amount
    //     };
    //     logger.info(`Updating token: ${JSON.stringify(updatedToken)}`);
    //     await ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedToken)));
    // }

    /**
     * Import the Data
     * @param {*} ctx 
     * @param {*} identityString 
     * @returns 
     */
    // async importData(ctx, identityString) {
    //     let identity = JSON.parse(identityString)
    //     for (let i = 0; i < identity.length; i++) {
    //         await ctx.stub.putState(identity[i].key, Buffer.from(JSON.stringify(identity[i].data)));
    //     }
    //     return { "msg": "Data added successfully!" };
    // }


    async verifySignatures(publicKey, encryptedValue, value, algo) {
        try {
            let __publicKey = crypto.createPublicKey({ key: publicKey, format: 'pem', type: 'pkcs1' })
            let dataToHash = value;
            const signature = encryptedValue;
            const signedValue = signature.toString('base64');
            const verify = crypto.createVerify(algo);
            verify.update(dataToHash);
            let checkSignature = verify.verify(__publicKey, signedValue, 'base64')
            return checkSignature
        } catch (error) {
            return error.message;
        }

    }
}

module.exports = Identity;
