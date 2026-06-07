const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketRoutes = require('./routes/marketRoutes');
const communityRoutes = require('./routes/communityRoutes');
const soilRoutes = require('./routes/soilRoutes');

// Mock Disease Model (Inline for simplicity in this demo)
const diseaseSchema = new mongoose.Schema({
  diseaseName: String,
  confidence: Number,
  symptoms: [String],
  treatment: {
    organic: [String],
    chemical: [String]
  },
  severity: String, // 'Low', 'Moderate', 'Critical'
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const DiseaseResult = mongoose.model('DiseaseResult', diseaseSchema);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/soil', soilRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AgriGuide Backend Server v2.0 is running' });
});

// Disease Detection Mock Route
app.post('/api/disease/detect', async (req, res) => {
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockDiseases = [
      {
        diseaseName: 'Late Blight',
        confidence: 94.8,
        symptoms: ['Dark water-soaked spots on leaves', 'White fuzzy growth on underside', 'Rapid leaf browning'],
        treatment: {
          organic: ['Apply Copper-based fungicides', 'Remove infected plants immediately'],
          chemical: ['Chlorothalonil spray', 'Mancozeb application']
        },
        severity: 'Critical'
      },
      {
        diseaseName: 'Early Blight',
        confidence: 88.2,
        symptoms: ['Target-like concentric rings', 'Yellowing around spots', 'Lower leaf drop'],
        treatment: {
          organic: ['Prune lower branches', 'Improve air circulation'],
          chemical: ['Azoxystrobin', 'Daconil']
        },
        severity: 'Moderate'
      },
      {
        diseaseName: 'Leaf Mold',
        confidence: 91.5,
        symptoms: ['Pale green spots on upper leaf', 'Olive-green velvet growth underneath'],
        treatment: {
          organic: ['Reduce humidity', 'Increase plant spacing'],
          chemical: ['Sulfur dust', 'Chlorothalonil']
        },
        severity: 'Low'
      },
      {
        diseaseName: 'Healthy Leaf',
        confidence: 99.1,
        symptoms: ['Normal green pigmentation', 'Robust cell structure', 'No visible pathogens'],
        treatment: {
          organic: ['Continue standard watering', 'Maintain soil nutrition'],
          chemical: ['No chemical intervention needed']
        },
        severity: 'Low'
      }
    ];

    const randomResult = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    const newResult = new DiseaseResult(randomResult);
    await newResult.save();

    res.status(200).json(newResult);
  } catch (err) {
    res.status(500).json({ error: 'Detection failed' });
  }
});

app.get('/api/disease/history', async (req, res) => {
  try {
    const history = await DiseaseResult.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Database Connection
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/agriguide';
mongoose.connect(mongoURI, { family: 4 })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

