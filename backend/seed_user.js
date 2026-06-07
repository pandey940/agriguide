const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedUser = async () => {
  await mongoose.connect('mongodb://localhost:27017/agriguide');
  
  const email = 'root@gmail.com';
  const password = 'password123';
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('User already exists');
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name: 'Root User',
    email,
    password: hashedPassword
  });

  await newUser.save();
  console.log('Created user root@gmail.com with password password123');
  process.exit(0);
};

seedUser().catch(console.error);
