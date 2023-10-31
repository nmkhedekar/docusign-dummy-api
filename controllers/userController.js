const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const User = require("../models/User");
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require('../utils/index');

const showCurrentUser = async (req, res) => {
    console.log("showCurrentUser", req.user)    
    res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
    const { email, name, phone } = req.body;
    console.log("updateUser", req.body);
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;

    await user.save();
    console.log("updatedUser", user);
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({
        user: tokenUser, customer
    });
};

module.exports = {
    showCurrentUser
}