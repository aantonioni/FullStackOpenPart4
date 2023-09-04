const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const testHelper = require('../helpers/test_helper');

const app = require('../app');
const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('add user validation', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('password or username present', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      name: 'Bob Bobson',
      password: 'password123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('missing username or password');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('username validation', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'bb',
      name: 'Bob Bobson',
      password: 'password123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username or password must be 3 characters long');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('password validation', async () => {
    const usersAtStart = await testHelper.usersInDb();

    const newUser = {
      username: 'bbob',
      name: 'Bob Bobson',
      password: 'pa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username or password must be 3 characters long');

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});