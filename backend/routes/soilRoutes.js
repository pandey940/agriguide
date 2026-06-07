const express = require('express');
const router = express.Router();
const SoilReport = require('../models/SoilReport');

// Mock Recommendation Engine
const getRecommendations = (n, p, k, ph) => {
  // Simple rule-based mock logic
  const crops = [
    { name: 'Wheat', n: [200, 350], p: [15, 30], k: [150, 300], ph: [6.0, 7.5], season: 'Rabi', window: 'Nov - Dec' },
    { name: 'Rice', n: [250, 400], p: [20, 40], k: [200, 350], ph: [5.0, 6.5], season: 'Kharif', window: 'Jun - Jul' },
    { name: 'Cotton', n: [180, 300], p: [10, 25], k: [100, 250], ph: [5.5, 7.5], season: 'Kharif', window: 'May - Jun' },
    { name: 'Maize', n: [220, 380], p: [18, 35], k: [180, 320], ph: [5.8, 7.2], season: 'Kharif', window: 'Jun - Jul' },
    { name: 'Soybean', n: [150, 280], p: [12, 28], k: [120, 280], ph: [6.0, 7.0], season: 'Kharif', window: 'Jun - Jul' },
  ];

  return crops.map(crop => {
    let score = 100;
    if (n < crop.n[0] || n > crop.n[1]) score -= 15;
    if (p < crop.p[0] || p > crop.p[1]) score -= 15;
    if (k < crop.k[0] || k > crop.k[1]) score -= 15;
    if (ph < crop.ph[0] || ph > crop.ph[1]) score -= 15;
    return {
      cropName: crop.name,
      suitability: Math.max(score, 60), // Clamp to 60 for demo
      season: crop.season,
      sowWindow: crop.window
    };
  }).sort((a, b) => b.suitability - a.suitability).slice(0, 5);
};

// Analyze Soil Route
router.post('/analyze', async (req, res) => {
  try {
    const { n, p, k, ph, ec, organicCarbon, soilType, location } = req.body;
    
    // Get recommendations from our "engine"
    const recommendations = getRecommendations(n, p, k, ph);

    const report = new SoilReport({
      n, p, k, ph, ec, organicCarbon, soilType, location,
      recommendations
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during soil analysis' });
  }
});

// Soil History Route
router.get('/history', async (req, res) => {
  try {
    const reports = await SoilReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching soil history' });
  }
});

// OCR Extraction Route (Mock)
router.post('/ocr-extract', async (req, res) => {
  try {
    // In a real application, this would accept a file upload (e.g., using multer),
    // send the image to Google Vision API, parse the text, and extract the values.
    // Here we mock the delay and return simulated extracted data.
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomize slightly to feel realistic
    const extractedData = {
      n: Math.floor(Math.random() * (350 - 200) + 200),
      p: Math.floor(Math.random() * (40 - 10) + 10),
      k: Math.floor(Math.random() * (300 - 150) + 150),
      ph: (Math.random() * (8.0 - 5.5) + 5.5).toFixed(1),
      ec: (Math.random() * (1.5 - 0.2) + 0.2).toFixed(2),
      organicCarbon: (Math.random() * (1.5 - 0.4) + 0.4).toFixed(2)
    };
    
    res.json(extractedData);
  } catch (err) {
    res.status(500).json({ error: 'OCR Extraction failed' });
  }
});

module.exports = router;
