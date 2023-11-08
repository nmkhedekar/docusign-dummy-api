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
    getUploadedDocumentList,
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
    getUploadedDocumentList,
    getUploadedDocument,
    modifyDocument,
    modifyDocumentWithImageSign,
    uploadSignature
}
