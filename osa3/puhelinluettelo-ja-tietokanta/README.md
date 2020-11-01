# Link to the Heroku app

[https://happy-fullstack-osa3.herokuapp.com](https://happy-fullstack-osa3.herokuapp.com)

## How to deploy this subdirectory to Heroku

```
$ heroku git:remote -a happy-fullstack-osa3
$ git subtree push --prefix osa3/puhelinluettelo-backend heroku main
```

Example command from:   
[Deploy Git subdirectory to Heroku](https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f)

## Using yarn

```
$ pwd
<full path to working tree>/osa3/puhelinluettelo-backend
$ yarn deploy
```
