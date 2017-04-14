"use strict";
const crypto = require("crypto");
const Salt = '63293188';
const Iterations = 1000;
function kdf(password, salt, iterations) {
    let pwd = new Buffer(password, 'utf-8');
    let s = new Buffer(salt, 'utf-8');
    let key = Buffer.concat([pwd, s]);
    let i;
    for (i = 0; i < iterations; i += 1) {
        key = crypto.createHash('md5').update(key).digest();
    }
    return key;
}
function getKeyIv(password, salt, iterations) {
    let key = kdf(password, salt, iterations);
    let keybuf = key.slice(0, 8);
    let ivbuf = key.slice(8, 16);
    return [keybuf, ivbuf];
}
function encrypt(payload, password, salt, iterations) {
    let kiv = getKeyIv(password, salt, iterations);
    let cipher = crypto.createCipheriv('des', kiv[0], kiv[1]);
    let encrypted = [];
    // let b = new Buffer(new Uint8Array([0xd6, 0xda, 0xc1, 0xda]));
    encrypted.push(cipher.update(payload, 'utf-8', 'hex'));
    encrypted.push(cipher.final('hex'));
    return new Buffer(encrypted.join(''), 'hex').toString('hex');
}
function decrypt(payload, password, salt, iterations) {
    let encryptedBuffer = new Buffer(payload, 'base64');
    let kiv = getKeyIv(password, salt, iterations);
    let decipher = crypto.createDecipheriv('des', kiv[0], kiv[1]);
    let decrypted = [];
    decrypted.push(decipher.update(encryptedBuffer));
    decrypted.push(decipher.final());
    return decrypted.join('');
}
function passwordEncrypt(username, password) {
    return encrypt(username, password, Salt, Iterations);
}
exports.passwordEncrypt = passwordEncrypt;
