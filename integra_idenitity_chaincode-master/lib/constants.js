'use strict';

/**
 * chaincode constants
 */

/**
 * asset types
 */
exports.TOKEN_TYPE = 'token';

/**
 * attributes
 */
exports.ROLE_ATTRIBUTE = 'app_role';
exports.ENROLLMENT_ID_ATTRIBUTE = 'hf.EnrollmentID';

/**
 * user roles
 */
exports.CUSTOMER_ROLE = 'customer';

/**
 * composite keys
 */
exports.USTOMER_TOKEN_KEY = 'customer~token';

exports.IDENTITY_FEE = 1;

exports.ENCRYPTION_ALGO = 'sha256';

exports.TOKEN_HISTORY_DOC_TYPE = 'token_history';

exports.TOKEN_ACTIONS = {
    0: 'DEBIT',
    1: 'CREDIT',
    2: 'ISSUED',
    3: 'ISSUED-REDEEMED'
}

exports.TOKEN_ACTIONS_ENUM = {
    'DEBIT': 0,
    'CREDIT': 1,
    'ISSUED': 2,
    'ISSUED_REDEEMED': 3
}

exports.TOKEN_ISSUE_TX_STATUS = {
    'NORMAL': 0,
    'PENDING': 1,
    'REDEEMED': 2,
}

