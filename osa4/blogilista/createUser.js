// Usage: node createUser.js <name> <username> <password>
//
// Note: another option for implementation would have been to use
// axios.post for the /api/users endpoint when the backend is running.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users');

if (process.argv.length !== 5) {
  console.log('Usage: node createUser.js <name> <username> <password>');
  console.log('Usage: node createUser.js "Sami Testaaja" sami salasana');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;
const name = process.argv[2];
const username = process.argv[3];
const password = process.argv[4];

async function connectToMongo() {
  try {
    await mongoose.connect(MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
    );
    console.log('connected to MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function createUser(username, name, password) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, name, passwordHash });
    console.log(user);
    await user.save();
    console.log('User created');
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectToMongo();
createUser(username, name, password);
