require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.info('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.send(`<h1>Hello</h1><p>You have saved ${blogs.length} blogs`);
  });
});

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});