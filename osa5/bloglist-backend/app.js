const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const loginRouter = require('./controllers/loginController');
const userRouter = require('./controllers/userController');
const blogRouter = require('./controllers/blogController');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', error.message));

morgan.token('postputdata', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return ' ';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postputdata'));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;
