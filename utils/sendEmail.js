const nodemailer = require('nodemailer');
// const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = nodemailer.createTestAccount();

  //https://ethereal.email/
  const transporter = await nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: "lesley.ruecker28@ethereal.email",//testAccount.user,
      pass: "P6cnr8Xx5SgC1QXb6G",//testAccount.pass,
    },
    // service: "gmail",
    // auth: {
    //   user: "",//testAccount.user,
    //   pass: "",//testAccount.pass,
    // },
  });

  return transporter.sendMail({
    from: '"Voptrics" <voptrics@gmail.com>', // sender address
    to,
    subject,
    html,
  }, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err.message);
      return process.exit(1);
    }

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
};

module.exports = sendEmail;
