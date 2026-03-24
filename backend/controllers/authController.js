const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwtService = require('../services/jwtService');
const users = require('../models/user');
const tokens = require('../models/token');

const register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || email.trim().length <= 0) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }
    // Create new user
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = { id, email, hashedPassword, role: 'USER' };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const matchingUser = users.find(user => user.email === email);
    if (!matchingUser) {
        return res.status(401).json({ message: 'No matching user found' });
    }
    const isPasswordValid = await bcrypt.compare(password, matchingUser.hashedPassword);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const userId = matchingUser.id;
    const familyId = uuidv4();
    const accessToken = jwtService.generateAccessToken({ userId, role: matchingUser.role });
    const refreshToken = jwtService.generateRefreshToken(userId, familyId);
    tokens.push({ userId, refreshToken, familyId });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ accessToken });
};

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const { userId, familyId } = decoded;
    const tokenExists = tokens.find(token => token.refreshToken === refreshToken);
    if (!tokenExists) {
        jwtService.invalidateTokenFamily(familyId);
        return res.status(400).json({ message: 'Refresh token is not valid' });
    }
    jwtService.deleteRefreshToken(refreshToken);
    const matchingUser = users.find(user => user.id === userId);
    const newAccessToken = jwtService.generateAccessToken({ userId, role: matchingUser.role });
    const newRefreshToken = jwtService.generateRefreshToken(userId, familyId);
    tokens.push({ userId, refreshToken: newRefreshToken, familyId });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ accessToken: newAccessToken });
};

const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    jwtService.deleteRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

const getPublic = (req, res) => {
    res.json({ message: 'Public route' });
};

const getProtected = (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
}

const getAdmin = (req, res) => {
    res.json({ message: 'Admin route', user: req.user });
}

module.exports = {
    register,
    login,
    refresh,
    logout,
    getPublic,
    getProtected,
    getAdmin
};