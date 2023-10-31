const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/full-auth');
const { showCurrentUser } = require("../controllers");

router.route('/showMe').get(
    authenticateUser,
    showCurrentUser);

module.exports = router;