const crypto = require('crypto');

/**
 * Utility functions for password hashing and verification using Node.js crypto
 * This is a more container-friendly alternative to bcrypt or argon2
 */
const passwordUtils = {
  /**
   * Hash a password using PBKDF2
   * @param {string} password - Plain text password
   * @returns {string} - Hash representation (salt:hash)
   */
  hashPassword: async (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');
    
    return `${salt}:${hash}`;
  },
  
  /**
   * Verify a password against a hash
   * @param {string} password - Plain text password to verify
   * @param {string} hashedPassword - Hash representation (salt:hash)
   * @returns {boolean} - True if password matches
   */
  verifyPassword: async (password, hashedPassword) => {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');
    
    return storedHash === hash;
  }
};

module.exports = passwordUtils; 