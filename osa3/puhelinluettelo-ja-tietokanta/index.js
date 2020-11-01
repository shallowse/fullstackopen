require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

morgan.token('postdata', (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return ' ';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'));
app.use(express.static('build'));

// Routes
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => res.json(savedPerson.toJSON()));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ errror: 'name or number missing' });
  }

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {new: true})
    .then(updatedPerson => res.json(updatedPerson.toJSON()))
    .catch(error => next(error));
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  Person.find({})
    .then(persons => {
      const numPersons = persons.length;
      const text = `Phonebook has info for ${numPersons} people<br><br>${date}`;
      res.set('Content-Type', 'text/html').send(text);
    });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// Error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(err);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
