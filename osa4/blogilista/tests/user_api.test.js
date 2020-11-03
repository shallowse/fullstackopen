const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const User = require('../models/users');

describe('when there are initially two users at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    // https://stackoverflow.com/a/40140562
    // Promise.all
    const users = await Promise.all(helper.initialUsers.map(async user => {
      const passwordHash = await bcrypt.hash('secret', 10);
      user.passwordHash = passwordHash;
      return user;
    }));

    await User.insertMany(users);
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'testaajatesteri',
      name: 'Johannes Liimatainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with missing username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Sami Testaaja',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with missing password', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'samitestaaja',
      name: 'Sami Testaaja',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password not set or <= 3 characters');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with too short username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'sa',
      name: 'Sami Testaaja',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('User validation failed: username: Path `username`');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with too short password', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'samitestaaja',
      name: 'Sami Testaaja',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password not set or <= 3 characters');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
