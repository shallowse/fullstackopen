# Some comments

## Contents of 'bloglist-backend/.env' file

Remember to add the .env file to the 'bloglist-backend' directory

```
MONGODB_URI=mongodb+srv://<address>  
PORT=3001
SECRET=<secret phrase>  
TEST_MONGODB_URI=mongodb+srv://<address of test database>
```

## How to create some users to the database

Create some users to the database by running the createUsers.js command

```
Usage: node createUser.js <name> <username> <password>

$ node createUser.js 'Sami Testaaja' sami salasana
$ node createUser.js 'Tiina Testaaja' tiina salasana
```

Note: user creation and blog content creation is done automatically in the tests to test database. The
tests are in folder '/tests'.