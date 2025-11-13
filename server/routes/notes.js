const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");
const verifyToken = require("../middleware/verifyToken");
require("dotenv").config();

const router = express.Router();


router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, description, subject, department } = req.body;

    const note = new Note({
      title,
      description,
      subject,
      department,
      filePath: req.file.path.replace(/\\/g, "/"), 
      uploadedBy: req.user._id,
    });

    await note.save();
    res.json({ message: "✅ Note uploaded successfully!", note });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: "Failed to upload note" });
  }
});


router.get("/all", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("All Notes Error:", error.message);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});


router.get("/my-notes/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ uploadedBy: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("My Notes Error:", error.message);
    res.status(500).json({ error: "Failed to fetch user notes" });
  }
});


router.get("/search", async (req, res) => {
  try {
    const { subject, department, keyword } = req.query;
    let query = {};

    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (department) query.department = { $regex: department, $options: "i" };
    if (keyword)
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ error: "Failed to search notes" });
  }
});


router.get("/download/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.download(path.join(__dirname, "../", note.filePath));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
