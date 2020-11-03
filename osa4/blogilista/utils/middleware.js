const logger = require('./logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: `unknown endpoint: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'SyntaxError' || err.name === 'TypeError') {
    // SyntaxError encountered e.g. while receiving malformed JSON data in POST/PUT
    // TypeError encountered e.g. while submitting data with wrong field name
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }

  next(err);
};

// Get JSON Web Token from request Header 'Authorization'
// We expect the value to be 'Authorization': 'Bearer <token>'
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  const keyword = 'bearer ';
  if (authorization && authorization.toLowerCase().startsWith(keyword)) {
    req.token = authorization.substring(keyword.length);
  } else {
    req.token = undefined;
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
