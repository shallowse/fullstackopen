# Link to this version's Heroku app

Please note that the directory ```/osa3/puhelinluettelo-ja-tietokanta``` contains the final version of this section's
implementation.

The app is running in Heroku:
[https://happy-osa3-puhelinluettelo.herokuapp.com](https://happy-osa3-puhelinluettelo.herokuapp.com)

## Deploying the app to Heroku

```
$ pwd
<full path to working tree>/osa3/puhelinluettelo-ja-tietokanta
$ npm run build:ui

$ cd ../../

$ git add . 

$ git commit -m <commit message>

$ git push origin main

$ git remote add heroku https://git.heroku.com/happy-osa3-puhelinluettelo.git
>> Comment: in case the Heroku repo has not been setup

$ heroku repo:reset --app happy-osa3-puhelinluettelo
>> Comment: when testing I wanted to reset the app and start afresh

$ heroku config:set MONGODB_URI=mongodb+srv://<address with database name>

$ git subtree push --prefix osa3/puhelinluettelo-ja-tietokanta heroku main
```

I decided to keep the osa3 implemetation in the same repository as all the other osa implementations.
For deploying the app to Heroku I utilized the following instructions:

1. Set MONGODB_URI environment variable [link](https://stackoverflow.com/a/40138520).  
2. Deploying subdirectory to Heroku [link](https://jtway.co/deploying-subdirectory-projects-to-heroku-f31ed65f3f2).  
3. Just in case reset the Heroku git repo [link](https://devcenter.heroku.com/articles/git#resetting-a-git-repository)

## For local testing the contents of '.env' file

Remember to add the .env file to the this directory

```
MONGODB_URI=mongodb+srv://<address with database name>  
PORT=3001
```

