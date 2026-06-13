const Note = require('../models/Note');

// @desc    Get all notes for a specific video
// @route   GET /api/notes/:videoId
// @access  Public
exports.getNotesByVideo = async (req, res) => {
  try {
    // Find notes matching the videoId and sort them chronologically by timestamp
    const notes = await Note.find({ videoId: req.params.videoId }).sort({ timestampInSeconds: 1 });
    
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new time-stamped note
// @route   POST /api/notes
// @access  Public
exports.createNote = async (req, res) => {
  try {
    const { videoId, noteText, timestampInSeconds } = req.body;

    const note = await Note.create({
      videoId,
      noteText,
      timestampInSeconds
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


