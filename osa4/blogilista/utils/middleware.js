const logger = require('./logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'SyntaxError') { // encoutered e.g. while receiving malformed JSON data in POST/PUT
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
