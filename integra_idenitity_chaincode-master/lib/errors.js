'use strict';

class IdentityNotFound extends Error {
    constructor(message = "Identity does not exists!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
    }
}

class OwnerExists extends Error {
    constructor(message = "Owner ID has been taken!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}

class OwnerDoesNotExists extends Error {
    constructor(message = "Owner ID does not exists!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
    }
}

class InSufficientTokenAmount extends Error {
    constructor(message = "Insufficient token amount, please add tokens!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}

class InvalidPublicKey extends Error {
    constructor(message = "Invalid integra public key!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}


class InvalidSignature extends Error {
    constructor(message = "Signature not matched please verify it again!") {
        super(message);
        this.name = this.constructor.name;
        this.status = 400;
    }
}
module.exports = {
    IdentityNotFound,
    OwnerExists,
    OwnerDoesNotExists,
    InSufficientTokenAmount,
    InvalidPublicKey,
    InvalidSignature
};
