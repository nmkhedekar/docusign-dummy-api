const express = require('express');
const { uploadDocument, getUploadedDocument, modifyDocument, modifyDocumentWithImageSign, uploadSignature } = require('../controllers');
const { uploadMulti, uploadMultiImage } = require("../utils/uploadMulti");
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');

const router = express.Router()

router.route("/upload-document").post([authenticateUser, uploadMulti.array('multiFile', 10)], uploadDocument);
router.route("/get-document").post(authenticateUser, getUploadedDocument);
router.route("/modify-document").patch(authenticateUser, modifyDocument);
router.route("/modify-document-with-img-sign").patch(authenticateUser, modifyDocumentWithImageSign);
router.route("/upload-signature").post([authenticateUser, uploadMultiImage.array('multiFile', 10) ], uploadSignature);

module.exports = router;