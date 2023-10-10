const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'dcmailreceiver@gmail.com',
    pass: 'vztf hlnn bqgl jann',
  },
});

module.exports = (to, subject, text) => new Promise((resolve, reject) => {
  const message = {
    to,
    subject,
    text,
  };
  
  transport.sendMail(message, (err, info) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(info);
  });
});