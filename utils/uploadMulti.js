const multer  = require('multer');
const shortid = require("shortid");
const picPath = require("path");

const storageMulti = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, DIR);
        cb(null, picPath.join(picPath.dirname(__dirname), "public/documents"));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    }
});

var uploadMulti = multer({
    storage: storageMulti,

    // for file extention validation
    fileFilter: (_req, file, cb) => {
        const filetypes = /pdf/;        
        // Check ext
        const extname = filetypes.test(picPath.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    }
});

const storageMultiImage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, DIR);
        cb(null, picPath.join(picPath.dirname(__dirname), "public/signatures"));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, shortid.generate() + '-' + fileName)
    }
});

var uploadMultiImage = multer({
    storage: storageMultiImage,

    // for file extention validation
    fileFilter: (_req, file, cb) => {        
        const filetypes = /jpeg|jpg|png/; 
        // Check ext
        const extname = filetypes.test(picPath.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    }
});

module.exports = {
    uploadMulti,
    uploadMultiImage
}