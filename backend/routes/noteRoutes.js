const express = require('express');
const router = express.Router();
const { getNotesByVideo, createNote } = require('../controllers/noteController');

// Map the routes to controller functions
router.route('/').post(createNote);
router.route('/:videoId').get(getNotesByVideo);

module.exports = router;


// DELETE a specific note by its ID
router.delete('/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    
    // Assumes your mongoose model is named Note
    const deletedNote = await Note.findByIdAndDelete(noteId);
    
    if (!deletedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    
    res.status(200).json({ success: true, message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Backend error deleting note:", error);
    res.status(500).json({ success: false, message: "Server error deleting note" });
  }
});

// GET notes for a specific video
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    // Query MongoDB for notes matching the current videoId
    const notes = await Note.find({ videoId }).sort({ timestampInSeconds: 1 });
    
    res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error("Backend error fetching notes:", error);
    res.status(500).json({ success: false, message: "Server error fetching notes" });
  }
});