const supertest = require('supertest');
const mongoose = require('mongoose');
const testHelper = require('../helpers/test_helper');

const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

let auth;

beforeAll(async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret'});

  auth = 'Bearer ' + loginResponse.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of testHelper.blogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('getting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(testHelper.blogs.length);
  });

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('adding blogs', () => {
  test('add blog', async () => {
    const response = await api.get('/api/blogs');
    const blogCountBefore = response.body.length;
    
    await api
      .post('/api/blogs')
      .set('Authorization', auth)
      .send(testHelper.blogToAdd)
      .expect(201);

    const secondResponse = await api.get('/api/blogs');
    expect(secondResponse.body.length).toBe(blogCountBefore + 1);
  });

  test('blog with no like defaults to 0', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', auth)
      .send(testHelper.blogToAdd)
      .expect(201);

    const response = await api.get('/api/blogs');
    const blogs = response.body;
    const addedBlog = blogs.find((blog) => blog.title === testHelper.blogToAdd.title);

    expect(addedBlog).toBeDefined();
    expect(addedBlog.likes).toBe(0);
  });

  test('add blog with no title', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', auth)
      .send(testHelper.blogNoTitle)
      .expect(400);
  });

  test('add blog with no url', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', auth)
      .send(testHelper.blogNoUrl)
      .expect(400);
  });

  test('adding a blog while not logged in', async () => {
    await api
      .post('/api/blogs')
      .send(testHelper.blogToAdd)
      .expect(401);
  });
});

describe('deleting blogs', () => {
  test('delete blog', async () => {
    const result = await api
      .post('/api/blogs')
      .set('Authorization', auth)
      .send(testHelper.blogToDelete)
      .expect(201);

    const responseBefore = await api.get('/api/blogs');
    expect(responseBefore.body).toHaveLength(testHelper.blogs.length + 1);

    const id = result.body.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', auth)
      .expect(204);

    const responseAfter = await api.get('/api/blogs');
    expect(responseAfter.body).toHaveLength(testHelper.blogs.length);
  });
});

describe('updating blogs', () => {
  test('update blog', async () => {
    const response = await api
      .put(`/api/blogs/${testHelper.blogToUpdateId}`)
      .send(testHelper.blogToUpdate);

    expect(response.body.likes).toEqual(testHelper.blogToUpdate.likes);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});