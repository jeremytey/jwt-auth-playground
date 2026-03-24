const jwt = require('jsonwebtoken');
const tokens = require('../models/token');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
}

const generateRefreshToken = (userId, familyId) => {
    return jwt.sign({ userId, familyId }, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' });
}

const verifyAccessToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    } catch (error) {
        throw new Error('Invalid access token');
    }
}

const verifyRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}

const deleteRefreshToken = (tokenDelete) => {
    const indexToDelete = tokens.findIndex(token => token.refreshToken === tokenDelete);
    if (indexToDelete !== -1) {
        tokens.splice(indexToDelete, 1);
    }
}

// This function removes all tokens that belong to the same family ID, effectively logging out the user from all sessions.
// filter the tokens to keep only those that do not belong to the specified family ID, then replace the original tokens array 
// with the filtered result.
const invalidateTokenFamily = (familyId) => {
    const remaining = tokens.filter(token => token.familyId !== familyId);
    tokens.splice(0, tokens.length, ...remaining);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    deleteRefreshToken,
    invalidateTokenFamily
}
