const express = require('express');
const router = express.Router();
const MarketPrice = require('../models/MarketPrice');

// Seed some initial data if empty
const seedMarketData = async () => {
  const count = await MarketPrice.countDocuments();
  if (count === 0) {
    const crops = ['Wheat', 'Rice', 'Onion', 'Tomato', 'Cotton', 'Soybean'];
    const mandis = ['Pune APMC', 'Nashik APMC', 'Vashi APMC', 'Lasalgaon APMC', 'Nagpur APMC'];
    
    for (let crop of crops) {
      for (let mandi of mandis) {
        // Generate last 7 days of prices
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          let basePrice = crop === 'Onion' ? 2000 : crop === 'Wheat' ? 2200 : crop === 'Cotton' ? 7000 : 3000;
          let randomShift = Math.floor(Math.random() * 400) - 200;
          
          await MarketPrice.create({
            commodity: crop,
            mandi: mandi,
            state: 'Maharashtra',
            price: basePrice + randomShift,
            unit: 'Quintal',
            date: date,
            trend: randomShift > 0 ? 'up' : 'down'
          });
        }
      }
    }
  }
};

router.get('/prices', async (req, res) => {
  try {
    await seedMarketData();
    const { crop, mandi } = req.query;
    
    let query = {};
    if (crop) query.commodity = crop;
    if (mandi) query.mandi = mandi;
    
    // Get latest prices for each mandi/crop combo
    // We'll simplify and just fetch recent ones
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const prices = await MarketPrice.find({ ...query, date: { $gte: today } }).sort({ date: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    await seedMarketData();
    const { crop, mandi } = req.query;
    
    if (!crop || !mandi) {
      return res.status(400).json({ error: 'Crop and mandi required for trends' });
    }
    
    const trends = await MarketPrice.find({ commodity: crop, mandi: mandi }).sort({ date: 1 }).limit(7);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch market trends' });
  }
});

module.exports = router;
