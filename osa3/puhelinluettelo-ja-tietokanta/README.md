# Link to this version's Heroku app

Please note that the directory ```/osa3/puhelinluettelo-ja-tietokanta``` contains the final version of this section's
implementation.

[https://happy-osa3-puhelinluettelo.herokuapp.com](https://happy-osa3-puhelinluettelo.herokuapp.com)

## Deploying the app to Heroku

```
$ pwd
<full path to working tree>/osa3/puhelinluettelo-ja-tietokanta
$ npm run build:ui
$ cd ../../
$ git add . 
$ git commit -m <commit message>
$ cd osa3/puhelinluettelo-ja-tietokanta/
$ npm run deploy
```

### Note: How to deploy a subdirectory to Heroku

```
$ git subtree push --prefix osa3/puhelinluettelo-backend heroku main
```

Example command from:   
[Deploy Git subdirectory to Heroku](https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f)

## Contents of '.env' file

Remember to add the .env file to the this directory

```
MONGODB_URI=mongodb+srv://<address>  
PORT=3001
```
