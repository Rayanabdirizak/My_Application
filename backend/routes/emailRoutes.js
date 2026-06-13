const express = require('express');
const router = express.Router();
const { sendLessonCompleteEmail } = require('../services/emailService');

// POST /api/email/lesson-complete
router.post('/lesson-complete', async (req, res) => {
  try {
    const { email, username, lessonTitle } = req.body;

    if (!email || !username || !lessonTitle) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const sent = await sendLessonCompleteEmail(email, username, lessonTitle);

    if (sent) {
      res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Email route error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;