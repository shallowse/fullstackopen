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
  if (req.method !== 'POST') {
    return ' ';
  }
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'));
app.use(express.static('build'));

// Routes
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons));
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => res.json(person));
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

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.deleteOne({ _id: id })
    .then(result => res.status(204).end())
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
