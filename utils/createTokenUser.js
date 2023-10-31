const createTokenUser = (user) => {
    console.log("createTokenUser", user);
    return { name: user.name, userId: user._id, role: user.role };
};

module.exports = createTokenUser;
