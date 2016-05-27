# CompareHCare frontend (Ionic)

## Running the app locally

- Create a free [Heroku account](https://signup.heroku.com/signup/dc).
- Also, install the [Heroku Toolbelt](https://toolbelt.heroku.com/).
- Check that you have the prerequisites installed properly by typing following commands.
```sh
$ node -v
$ npm -v
$ git --version
```

Then follow these steps:

```sh
$ heroku login

$ git clone https://github.com/lienmergan/comparehcare-ionic.git
$ cd comparehcare-ionic

$ npm install

$ bower install

$ heroku local web
```

The app should now be running on [localhost:5000](http://localhost:5000/).