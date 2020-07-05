const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //need to assign the api key in config

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "2017cs085@stu.ucsc.cmb.ac.lk",
    subject: "Thanks for joining in",
    text: `Welcome to the app, ${name}. Let us know how you get alog with the app`,
  });
};

const cancelUserEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "2017cs085@stu.ucsc.cmb.ac.lk",
    subject: "Account cancellation",
    text: `Good bye, ${name}. Let us know why you have cancelled your account`,
  });
};

module.exports = {
  sendWelcomeEmail,
  cancelUserEmail,
};
