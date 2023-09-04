const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/info', (request, response) => {
  Blog.find({}).then(blogs => {
    response.send(`<h1>Hello</h1><p>You have saved ${blogs.length} blogs`);
  });
});

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog.user || user.id === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    return response.status(401).json({ error: 'unauthorized to delete resource' });
  }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).end();
  } else {
    const user = request.user;
    const newBlog = {
      title: request.body.title,
      url: request.body.url,
      author: request.body.author,
      likes: request.body.likes || 0,
      user: user.id
    };

    const blog = new Blog(newBlog);
    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;