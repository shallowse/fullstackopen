const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

morgan.token('postdata', (req, res) => {
  if (req.method !== 'POST') {
    return ' ';
  }
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

const generateId = () => {
  const ID = Math.floor(Math.random() * 100000000);
  return ID;
};

app.get('/', (req, res) => {
  res.redirect('/api/persons');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (!person) {
    res.status(404).end();
    return;
  }

  res.json(person);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'name or number missing'});
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  const found = persons.find(person => person.name === newPerson.name)
  if (found) {
    return res.status(403).json({error: 'name must be unique'});
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  const numPersons = persons.length;
  const text = `Phonebook has info for ${numPersons} people<br><br>${date}`;
  res.set('Content-Type', 'text/html').send(text);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
