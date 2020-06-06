const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (userId = '5ecbd76038268b0fb848b357') => {

    const sessionObject = { passport: { user: userId } };
    const session = Buffer.from(JSON.stringify(sessionObject))
        .toString('base64');

    const sig = keygrip.sign('session=' + session);
    return { session, sig };
}