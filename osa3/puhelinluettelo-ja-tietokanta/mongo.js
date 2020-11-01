// Usage: node mongo.js <yourpassword> [<Name> <Phone number>]
const mongoose = require('mongoose');

const password = process.argv[2];
const insertPerson = process.argv.length === 5;

let name, number;
if (insertPerson) {
  name = process.argv[3];
  number = process.argv[4];
}

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.020aa.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (insertPerson) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(response => {
    console.log('person saved');
    mongoose.connection.close();
  });
} else {
  Person.find({})
    .then(result => {
      console.log('phonebook:');
      result.forEach(person => console.log(`${person.name} ${person.number}`));
      mongoose.connection.close();
    });
}

