'use strict';

const { TOKEN_TYPE } = require('./constants');

/**
 * chaincode helper methods
 * these methods are not exposed in the contract
 */

/**
 * Get an asset
 *
 * @async
 * @param {Context} ctx context
 * @param {string} key asset key
 * @returns {Promise<Object>} the asset object
 */
exports.ReadAsset = async (ctx, key) => {
    const assetJSON = await ctx.stub.getState(key);
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The asset '${key}' does not exist`);
    }
    return JSON.parse(assetJSON.toString());
};

/**
 * Delete an asset
 *
 * @async
 * @param {Context} ctx context
 * @param {string} key asset key
 */
exports.DeleteAsset = async (ctx, key) => {
    const assetJSON = await ctx.stub.getState(key);
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The asset '${key}' does not exist`);
    }
    await ctx.stub.deleteState(key);
}

/**
 * Check if an asset exist
 *
 * @async
 * @param {Context} ctx context
 * @param {string} key asset key
 * @returns {Promise<boolean>} true if the asset exists, false otherwise
 */
exports.AssetExists = async (ctx, key) => {
    const assetJSON = await ctx.stub.getState(key);
    return assetJSON && assetJSON.length > 0;
};

/**
 * Returns composite asset keys
 *
 * @async
 * @param {Context} ctx context
 * @param {string} compositeKey the name of the composite key
 * @param {string[]} partialKeyItems an array of partial keys
 * @returns {Promise<string[]>} a list of asset keys
 */
exports.GetAssetKeysByPartialKey = async (ctx, compositeKey, partialKeyItems) => {
    const allResults = [];
    const iterator = await ctx.stub.getStateByPartialCompositeKey(compositeKey, partialKeyItems);
    let result = await iterator.next();
    while (!result.done) {
        allResults.push(result.value.key);
        result = await iterator.next();
    }
    return allResults;;
}

/**
 * Get all assets for a given docType
 *
 * @async
 * @param {Context} ctx context
 * @param {string} docType the docType value
 * @returns {Promise<Object[]>} a list of asset key/value pairs
 */
exports.QueryAssetsByDocType = async (ctx, docType) => {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = docType;
    return await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
};

/**
 * Get tokens for a customer
 *
 * @async
 * @param {Context} ctx context
 * @param {string} customer the id of the customer
 * @returns {Promise<Object[]>} a list of tokens
 */
exports.QueryTokensByCustomer = async (ctx, customer) => {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = TOKEN_TYPE;
    queryString.selector.Customer = customer;
    let results = await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    return results.map(r => r.Record);
}

/**
 * Query the identity record by field
 * @param {*} ctx 
 * @param {*} field 
 * @param {*} value 
 * @returns 
 */
exports.QueryIdentityByField = async (ctx, field, value) => {
    let queryString = {};
    queryString.selector = {};
    queryString.selector[field] = value;
    let results = await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    return results;
}

/**
 * Query the identity record by field with sorting
 * @param {*} ctx 
 * @param {*} field 
 * @param {*} value 
 * @returns 
 */
 exports.QueryIdentityByFieldSort = async (ctx, field, value) => {
    let queryString = {};
    queryString.selector = {};
    queryString.selector[field] = value;
    queryString.sort = [{"creationDate": "desc"}]
    let results = await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    return results;
}

/**
 * Query the top holders
 * @param {*} ctx 
 * @param {*} field 
 * @param {*} value 
 * @returns 
 */
 exports.QueryTopHolders = async (ctx, limit) => {
    let queryString = {};    
    queryString.selector = {};    
    queryString.sort = [{"tokenAmount": "desc"}];
    queryString.fields = [
        "integraId",
        "tokenAmount",
        "transactionId",
        "creationDate"
     ];
    queryString.limit = limit?limit:20;  
    let results = await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    return results;
}


/**
 * Query key by Integra ID
 * @param {*} ctx 
 * @param {*} integraId 
 * @returns 
 */
exports.QueryKeyByIntegraId = async (ctx, integraId) => {
    let queryString = {};
    queryString.selector = {
    };
    queryString.selector = {
        "$or": [
            {
                integraId: integraId
            },
            {
                owner: integraId
            }
        ]
    };
    let results = await GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    return results;
}

/**
 * Get assets for a CouchBD querystring
 *
 * @async
 * @param {Context} ctx context
 * @param {Object} queryString the querystring
 * @returns {Promise<Object[]>} a list of asset key/value pairs
 */
async function GetQueryResultForQueryString(ctx, queryString) {
    let resultsIterator = await ctx.stub.getQueryResult(queryString);
    return await GetAllResults(resultsIterator, false);
}

/**
 * Get all assets for a given iterator
 *
 * @async
 * @param {StateQueryIterator} iterator the iterator
 * @param {boolean} isHistory true to include the asset history, false otherwise
 * @returns {Promise<Object[]>} a list of asset key/value pairs
 */
async function GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
        if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
            if (isHistory && isHistory === true) {
                jsonRes.TxId = res.value.tx_id;
                jsonRes.Timestamp = res.value.timestamp;
                try {
                    jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = res.value.value.toString('utf8');
                }
            } else {
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
            }
            allResults.push(jsonRes);
        }
        res = await iterator.next();
    }
    iterator.close();
    return allResults;
}




