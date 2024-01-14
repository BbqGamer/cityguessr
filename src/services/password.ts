import crypto from "crypto";

const HASH_ALG = 'sha256';
const HASH_ITER = 310000;
const HASH_KEYLEN = 32;

export function hashPassword(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, HASH_ITER, HASH_KEYLEN, HASH_ALG);
}

export function getSalt(): Buffer {
    return crypto.randomBytes(32);
}

export function validatePassword(new_password: string, hashed_password: Buffer, salt: Buffer): boolean {
    const hash = crypto.pbkdf2Sync(new_password, salt, HASH_ITER, HASH_KEYLEN, HASH_ALG)
    return crypto.timingSafeEqual(hashed_password, hash)
}
