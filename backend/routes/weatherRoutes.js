const express = require('express');
const router = express.Router();

// Mock Weather Data Route
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query; // Would use this in real API
    
    // Mock 7-day forecast
    const today = new Date();
    const forecast = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: Math.floor(Math.random() * (40 - 25) + 25), // 25-40 C
        tempMin: Math.floor(Math.random() * (25 - 15) + 15), // 15-25 C
        humidity: Math.floor(Math.random() * (90 - 40) + 40), // 40-90%
        precipitation: Math.floor(Math.random() * 100), // 0-100% chance
        condition: ['Sunny', 'Cloudy', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)]
      };
    });

    // Mock Alerts
    const alerts = [];
    if (forecast[0].humidity > 80) {
      alerts.push({
        type: 'High Humidity',
        severity: 'Warning',
        message: 'High humidity detected. Increased risk for fungal diseases like Late Blight.'
      });
    }
    if (forecast[0].tempMax > 38) {
       alerts.push({
        type: 'Heatwave',
        severity: 'Critical',
        message: 'Extreme temperatures expected. Ensure adequate irrigation.'
      });
    }

    res.json({
      current: forecast[0],
      forecast: forecast.slice(1),
      alerts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
