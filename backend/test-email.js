require('dotenv').config();
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
t.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test Email from EduStream',
  text: 'Email is working!'
}, (err, info) => {
  if (err) console.log('ERROR:', err.message);
  else console.log('SUCCESS:', info.response);
});
