# Some comments

## Contents of 'bloglist-backend/.env' file

Remember to add the .env file to the 'bloglist-backend' directory

```
MONGODB_URI=mongodb+srv://<address>  
PORT=<port number>  
SECRET=<secret phrase>  
TEST_MONGODB_URI=mongodb+srv://<address of test database>
```

## How to create some users to the database

Create some users to the database (MONGODB_URI) e.g. with [PostMan](https://www.postman.com/)
by executing a POST request to address 'http://localhost:${PORT}/api/users' with a payload that contains the 
following fields  
```
{
  "username": "sami",
  "name": "Sami Testaja", 
  "password": "sami"
}
```

Note: user creation and blog content creation is done automatically in the tests to test database. The
tests are in folder '/tests'.
