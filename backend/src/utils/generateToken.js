import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for a given user ID
 * @param {string} id - User Mongoose ObjectId string
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
