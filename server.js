const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//configure db
const db = require('./config/keys').mongoURI;

//connect to mongodb 
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('database connected successfully'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);


// process.env.port is Heroku's port if you choose to deploy the app there
const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
