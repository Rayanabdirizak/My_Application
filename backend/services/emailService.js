const nodemailer = require('nodemailer');

const sendLessonCompleteEmail = async (toEmail, username, lessonTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EduStream 🎓" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `✅ Lesson Complete: ${lessonTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0c29, #302b63); padding: 40px; border-radius: 16px; color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 48px; margin: 0;">🎓</h1>
            <h2 style="color: #a78bfa; margin: 10px 0;">EduStream</h2>
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; text-align: center;">
            <h2 style="color: white; margin-bottom: 10px;">🎉 Lesson Complete!</h2>
            <p style="color: #9ca3af;">Hi <strong style="color: white;">${username}</strong>,</p>
            <p style="color: #9ca3af;">You just completed:</p>
            <h3 style="color: #a78bfa; font-size: 20px;">${lessonTitle}</h3>
            <p style="color: #9ca3af;">Keep up the great work! 🚀</p>
            <div style="margin-top: 24px; padding: 16px; background: rgba(102,126,234,0.2); border-radius: 8px;">
              <p style="color: #c4b5fd; margin: 0;">Keep learning and completing more lessons to earn your certificate! 🏆</p>
            </div>
          </div>
          <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px;">EduStream Advanced Learning Dashboard</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendLessonCompleteEmail };