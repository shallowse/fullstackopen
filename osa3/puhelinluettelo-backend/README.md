# Link to this version's Heroku app

Please note that the directory ```/osa3/puhelinluettelo-ja-tietokanta``` contains the final version of this section's
implementation.

[https://happy-osa3-puhelinluettelo.herokuapp.com/api/persons](https://happy-osa3-puhelinluettelo.herokuapp.com/api/persons)

## Deploying the app to Heroku

```
$ pwd
<full path to working tree>/osa3/puhelinluettelo-backend
$ npm run build:ui
$ npm run deploy
```

### Note: How to deploy a subdirectory to Heroku

```
$ git subtree push --prefix osa3/puhelinluettelo-backend heroku main
```

Example command from:   
[Deploy Git subdirectory to Heroku](https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f)

