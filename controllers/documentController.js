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
    try {
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
    } catch (err) {
        console.log("Err", err);
    }
}

const getUploadedDocumentList = async (req, res) => {
    try {
        const documentList = await Document.find({ userID: req.user.userId }).sort({ "createdAt": -1 });
        res.status(StatusCodes.OK).json({ msg: "success", data: documentList });
    } catch (err) {
        console.log("Err", err);
    }
}

const getUploadedDocument = async (req, res) => {
    try {
        console.log("body", req.body);
        const document = await Document.findOne({
            userID: new mongoose.Types.ObjectId(req.user.userId),
            _id: new mongoose.Types.ObjectId(req.body.documentId),
        });
        res.status(StatusCodes.OK).json({ msg: "success", data: document });
    } catch (err) {
        console.log("Err", err);
    }
}

const modifyDocument = async (req, res) => {
    let user = null;
    // debugger
    await User.findOne({ _id: req.user.userId }).then(async resp => {
        user = resp;
        console.log("user", resp);
        await Document.findOneAndUpdate({
            userID: new mongoose.Types.ObjectId(req.user.userId),
            _id: new mongoose.Types.ObjectId(req.body.documentId),
        }, {
            userName: req.body.name,
            email: req.body.email,
            status: "Completed"
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
                    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
                    const courierObliqueBold = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique)

                    // Get the first page of the document
                    const pages = pdfDoc.getPages()
                    console.log("pdf-pages", pages.length);


                    for (let i = 0; i < pages?.length; i++) {
                        const page = pages[i]

                        // Get the width and height of the page
                        const { width, height } = page.getSize()
                        console.log("size", { width, height })

                        // Draw a string of text diagonally across the page
                        page.drawText(`Envelope ID: ${req.user.userId} - ${resp?._id}`, {
                            x: 5,
                            y: height / 2 + 390,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0, 0, 0),
                        });
                        page.drawText("DEMONSTRATON DOCUMENT ONLY", {
                            x: 350,
                            y: height / 2 + 390,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                        });
                        page.drawText("PROVIDED BY DOCUSIGN DUMMY ONLINE SERVICE", {
                            x: 350,
                            y: height / 2 + 380,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                        });
                        page.drawText(req.body.name, {
                            x: 350,
                            y: height / 2 + 370,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                        });
                        page.drawText(`Contact No: ${user.phone}`, {
                            x: 350,
                            y: height / 2 + 360,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                        });
                        page.drawText(`Email: ${req.body.email}`, {
                            x: 350,
                            y: height / 2 + 350,
                            size: 8,
                            font: helveticaFont,
                            color: rgb(0.95, 0.1, 0.1),
                            // rotate: degrees(-45),
                        });
                        page.drawText(`Signed By`, {
                            x: 380,
                            y: height / 2 - 350,
                            size: 8,
                            font: helveticaBold,
                            color: rgb(0, 0, 0),
                            // rotate: degrees(-45),
                        });
                        page.drawText(req.body.signature, {
                            x: 380,
                            y: height / 2 - 370,
                            size: 10,
                            font: courierObliqueBold,
                            color: rgb(0, 0, 0),
                            // rotate: degrees(-45),
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
    try {
        debugger;
        let user = null;
        await User.findOne({ _id: req.user.userId }).then(async resp => {
            user = resp;
            console.log("user", resp);
            await Document.findOneAndUpdate({
                userID: new mongoose.Types.ObjectId(req.user.userId),
                _id: new mongoose.Types.ObjectId(req.body.documentId),
            }, {
                userName: req.body.name,
                email: req.body.email,
                status: "Completed"
            }).then(async resp => {
                // debugger
                let fileResp = resp;
                let reqFiles = [];
                let fileName = "";
                let mimeType = "";
                const url = req.protocol + '://' + req.get('host')
                console.log(url)
                console.log("body", { name: req.body.name, email: req.body.email })
                for (var i = 0; i < req.files.length; i++) {
                    console.log(req.files[i].filename)
                    fileName = req.files[i].filename;
                    mimeType = req.files[i].mimetype;
                    console.log("mimetype", req.files[i].mimetype)
                    //image/png image/jpeg image/jpg
                    reqFiles.push(url + '/public/signatures/' + req.files[i].filename)
                }
                console.log("signature", reqFiles);
                await Signature.create({
                    userID: req.user.userId,
                    userName: req.body.name,
                    signatureDate: new Date(),
                    filePath: reqFiles,
                    fileName,
                }).then(resp => {
                    debugger
                    console.log("resp", resp);

                    console.log("pdf-path", path.join(__dirname, "../public/documents/", fileResp?.fileName));

                    fs.readFile(path.join(__dirname, "../public/documents/", fileResp?.fileName), async (err, fileData) => {
                        if (err) {
                            console.log("err", err);
                        } else {
                            console.log("fileData", fileData);

                            // Create a new PDFDocument
                            // const pdfDoc = await PDFDocument.create()
                            const pdfDoc = await PDFDocument.load(fileData);
                            console.log("pdfDoc", pdfDoc);
                            // Load a PDFDocument from the existing PDF bytes

                            fs.readFile(path.join(__dirname, "../public/signatures/", resp?.fileName), async (err, data) => {
                                debugger
                                if (err) {
                                    console.log("err", err);
                                } else {

                                    debugger;
                                    console.log("pngImageBytes", data);

                                    // Embed the JPG image bytes and PNG image bytes                        
                                    const pngImage = await pdfDoc.embedPng(data)

                                    // Get the width/height of the PNG image scaled down to 50% of its original size
                                    const pngDims = pngImage.scale(0.1)

                                    // Embed the Helvetica font
                                    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
                                    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
                                    const courierObliqueBold = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique)

                                    // Get the first page of the document
                                    const pages = pdfDoc.getPages()
                                    console.log("pdf-pages", pages.length);

                                    for (let i = 0; i < pages?.length; i++) {
                                        const page = pages[i]

                                        // Get the width and height of the page
                                        const { width, height } = page.getSize()
                                        console.log("size", { width, height })

                                        // Draw a string of text diagonally across the page
                                        page.drawText(`Envelope ID: ${req.user.userId} - ${fileResp?._id}`, {
                                            x: 5,
                                            y: height / 2 + 390,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0, 0, 0),
                                        });
                                        page.drawText("DEMONSTRATON DOCUMENT ONLY", {
                                            x: 350,
                                            y: height / 2 + 390,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0.95, 0.1, 0.1),
                                        });
                                        page.drawText("PROVIDED BY DOCUSIGN DUMMY ONLINE SERVICE", {
                                            x: 350,
                                            y: height / 2 + 380,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0.95, 0.1, 0.1),
                                        });
                                        page.drawText(req.body.name, {
                                            x: 350,
                                            y: height / 2 + 370,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0.95, 0.1, 0.1),
                                        });
                                        page.drawText(`Contact No: ${user.phone}`, {
                                            x: 350,
                                            y: height / 2 + 360,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0.95, 0.1, 0.1),
                                        });
                                        page.drawText(`Email: ${req.body.email}`, {
                                            x: 350,
                                            y: height / 2 + 350,
                                            size: 8,
                                            font: helveticaFont,
                                            color: rgb(0.95, 0.1, 0.1),
                                            // rotate: degrees(-45),
                                        });
                                        page.drawText(`Signed By`, {
                                            x: 380,
                                            y: height / 2 - 350,
                                            size: 8,
                                            font: helveticaBold,
                                            color: rgb(0, 0, 0),
                                            // rotate: degrees(-45),
                                        });
                                        page.drawImage(pngImage, {
                                            x: 380,
                                            y: height / 2 - 380,
                                            width: pngDims.width,
                                            height: pngDims.height,
                                        })
                                    }

                                    // Serialize the PDFDocument to bytes (a Uint8Array)
                                    const pdfBytes = await pdfDoc.save();
                                    if (pdfBytes) {
                                        fs.unlinkSync(path.join(__dirname, "../public/documents/", fileResp?.fileName));
                                        fs.writeFileSync(path.join(__dirname, "../public/documents/", fileResp?.fileName), pdfBytes);
                                    }

                                    res.status(StatusCodes.CREATED).json({ msg: "success", data: fileResp })
                                }
                            })
                        }
                    })
                })

            }).catch(err => {
                console.log("modifyDocumentError", err);
            });
        }).catch(err => {
            console.log("userFindError", err);
        })

    } catch (err) {
        console.log("Err", err);
    }
}

const modifyDocumentWithImageSign = async (req, res) => {

}

module.exports = {
    uploadDocument,
    getUploadedDocumentList,
    getUploadedDocument,
    modifyDocument,
    modifyDocumentWithImageSign,
    uploadSignature
}