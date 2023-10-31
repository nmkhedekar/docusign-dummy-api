const {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require("./authController");

const {
    homeController
} = require("./homeController");

const {
    showCurrentUser
} = require("./userController");

const {
    uploadDocument,
    getUploadedDocument,
    modifyDocument,
    modifyDocumentWithImageSign,
    uploadSignature
} = require("./documentController");

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,

    homeController,

    showCurrentUser,

    uploadDocument,
    getUploadedDocument,
    modifyDocument,
    modifyDocumentWithImageSign,
    uploadSignature
}
