const { StatusCodes } = require('http-status-codes');
const Document = require("../models/Document");
const mongoose = require("mongoose");
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require("fs");
const { pathToFileURL } = require('url');
const path = require("path");
const User = require("../models/User");
const Signature = require("../models/Signature");

const uploadDocument = async (req, res) => {
    let reqFiles = [];
    let fileName = "";
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
    for (var i = 0; i < req.files.length; i++) {
        console.log(req.files[i].filename)
        fileName = req.files[i].filename;
        reqFiles.push(url + '/public/documents/' + req.files[i].filename)
    }
    console.log("document", reqFiles);
    const uploadedDocument = await Document.create({
        userID: req.user.userId,
        userName: req.user.name,
        ducumentDate: new Date(),
        filePath: reqFiles,
        fileName,
    });
    res.status(StatusCodes.CREATED).json({ msg: "success", data: uploadedDocument })
}

const getUploadedDocument = async (req, res) => {
    console.log("body", req.body);
    const document = await Document.findOne({
        userID: new mongoose.Types.ObjectId(req.user.userId),
        _id: new mongoose.Types.ObjectId(req.body.documentId),
    });
    res.status(StatusCodes.OK).json({ msg: "success", data: document });
}

const modifyDocument = async (req, res) => {
    let user = null;
    // debugger
    await User.findOne({ _id: req.user.userId }).then( async resp => {
        user = resp;
        console.log("user", resp);
        await Document.findOne({
            userID: new mongoose.Types.ObjectId(req.user.userId),
            _id: new mongoose.Types.ObjectId(req.body.documentId),
        }).then(async resp => {
            // debugger
            console.log("pdf-path", path.join(__dirname, "../public/documents/", resp?.fileName));
            const existingPdfBytes = fs.readFile(path.join(__dirname, "../public/documents/", resp?.fileName), async (err, data) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("data", data);
                    // Load a PDFDocument from the existing PDF bytes
                    const pdfDoc = await PDFDocument.load(data);
                    console.log("pdfDoc", pdfDoc);

                    // Embed the Helvetica font
                    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

                    // Get the first page of the document
                    const pages = pdfDoc.getPages()
                    console.log("pdf-pages", pages.length);

                    for (let i = 0; i < pages?.length; i++) {
                        const page = pages[i]

                        // Get the width and height of the page
                        const { width, height } = page.getSize()

                        // Draw a string of text diagonally across the page
                        page.drawText("DEMONSTRATON DOCUMENT ONLY", {
                            x: 5,
                            y: height / 2 + 300,
                            size: 50,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            rotate: degrees(-45),
                        });
                        page.drawText("PROVIDED BY DOCUSIGN DUMMY ONLINE SERVICE", {
                            x: 5,
                            y: height / 2 + 300,
                            size: 50,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            rotate: degrees(-45),
                        });
                        page.drawText(req.user.name, {
                            x: 5,
                            y: height / 2 + 300,
                            size: 50,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            rotate: degrees(-45),
                        });
                        page.drawText(`Contact No: ${user.phone}`, {
                            x: 5,
                            y: height / 2 + 300,
                            size: 50,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            rotate: degrees(-45),
                        });
                        page.drawText(`Email: ${user.email}`, {
                            x: 5,
                            y: height / 2 + 300,
                            size: 50,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            rotate: degrees(-45),
                        });
                    }

                    // Serialize the PDFDocument to bytes (a Uint8Array)
                    const pdfBytes = await pdfDoc.save();
                    if (pdfBytes) {
                        fs.unlinkSync(path.join(__dirname, "../public/documents/", resp?.fileName));
                        fs.writeFileSync(path.join(__dirname, "../public/documents/", resp?.fileName), pdfBytes);
                    }
                    res.status(StatusCodes.OK).json({ msg: "success", data: resp });
                }
            });

        }).catch(err => {
            console.log("modifyDocumentError", err);
        });
    }).catch(err => {
        console.log("userFindError", err);
    })
}

const uploadSignature = async (req, res) => {
    let reqFiles = [];
    let fileName = "";
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
    for (var i = 0; i < req.files.length; i++) {
        console.log(req.files[i].filename)
        fileName = req.files[i].filename;
        reqFiles.push(url + '/public/signatures/' + req.files[i].filename)
    }
    console.log("signature", reqFiles);
    const uploadedSignature = await Signature.create({
        userID: req.user.userId,
        userName: req.user.name,
        signatureDate: new Date(),
        filePath: reqFiles,
        fileName,
    });
    res.status(StatusCodes.CREATED).json({ msg: "success", data: uploadedSignature })
}

const modifyDocumentWithImageSign = async (req, res) => {

}

module.exports = {
    uploadDocument,
    getUploadedDocument,
    modifyDocument,
    modifyDocumentWithImageSign,
    uploadSignature
}