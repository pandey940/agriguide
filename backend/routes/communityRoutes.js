const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');

// Seed some initial community posts if empty
const seedCommunityData = async () => {
  const count = await CommunityPost.countDocuments();
  if (count === 0) {
    await CommunityPost.create([
      {
        author: 'Rajesh Patil',
        title: 'Yellowing leaves on Tomato plants',
        content: 'Hi everyone, my tomato leaves are starting to show yellow patches with black concentric circles. Is this early blight? What treatment is best?',
        category: 'Disease',
        tags: ['Tomato', 'Blight'],
        language: 'en',
        upvotes: 12,
        replies: [
          {
            author: 'Dr. Amit Sharma (Agronomist)',
            content: 'Yes, this looks like Early Blight. I recommend pruning the lower leaves to improve air circulation and applying copper fungicide.',
            isExpert: true
          }
        ]
      },
      {
        author: 'Sanjay Kumar',
        title: 'Bumper Onion harvest in Nashik Mandi',
        content: 'Onion prices seem to be stable at Nashik APMC today at around ₹2000 per quintal. Anyone planning to sell this week?',
        category: 'Market',
        tags: ['Onion', 'Nashik', 'Prices'],
        language: 'en',
        upvotes: 8,
        replies: [
          {
            author: 'Vikram Singh',
            content: 'I am holding for a few more days, expecting a slight price surge by next Monday.',
            isExpert: false
          }
        ]
      }
    ]);
  }
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    await seedCommunityData();
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

// Create a post
router.post('/', async (req, res) => {
  try {
    const { author, title, content, category, tags, language } = req.body;
    const post = new CommunityPost({ author, title, content, category, tags, language });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Add a reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { author, content, isExpert } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.replies.push({ author, content, isExpert });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Upvote post
router.put('/:id/upvote', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upvote' });
  }
});

module.exports = router;
