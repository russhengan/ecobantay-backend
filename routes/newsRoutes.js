// routes/newsRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const News = require("../models/News");

// Setup multer to store uploaded images in /uploads/news/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/news/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 POST route with image upload
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    console.log("📝 Body:", req.body);
    console.log("📷 File:", req.file);

    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/news/${req.file.filename}` : "";

    const news = await News.create({ title, content, imageUrl });
    res.status(201).json(news);
  } catch (err) {
    console.error("❌ Error posting news:", err.message);
    res.status(500).json({ message: "Failed to post news", error: err.message });
  }
});


// 📌 GET route to fetch all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch news", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete news", error: err.message });
  }
});

// Get specific news by ID
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch news item", error: err.message });
  }
});

// Update news
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Failed to update news", error: err.message });
  }
});

module.exports = router;
