# Login
<p>This is a simple login/Auth App with the MERN Stack.</p?
<p>We’ll be creating a minimal full-stack login/authorization app using the MERN stack (MongoDB for our database, Express and Node for our backend, and React for our frontend). We’ll also integrate Redux for state management for our React components.</p>
<p>Our app will allow users to
  <ul>
<li>Register</li>
<li>Log in</li>
<li>Access protected pages only accessible to logged in users</li>
<li>Stay logged in when they close the app or refresh the page</li>
<li>Log out</li>
    </ul>
<p>This should be a solid base to build off for a more functional full-stack MERN app.</p>
<p>In this part (part 1), we will
  <ul>
    
<li>Initialize our backend using npm and install necessary packages</li>
<li>Set up a MongoDB database using mLab</li>
<li>Set up a server with Node.js and Express</li>
<li>Create a database schema to define a User for registration and login purposes</li>
<li>Set up two API routes, register and login, using passport + jsonwebtokens for authentication and validator for input validation</li>
<li>Test our API routes using Postman</li>
<p>We’ll build our backend from scratch without boilerplate code, which I feel is more ideal for first learning about MERN apps. Before we get started
<h3>Prerequisites</h3>
You should have at least a basic understanding of fundamental programming concepts and some experience with introductory HTML/CSS/Javascript. If you don’t have experience with Javascript but have worked in Python, Ruby or another similar server-side language, you should still be able to follow along.
This post is not meant to explain the MERN stack or the technologies in it, but is a good introduction to building a full-stack app with it. However, you can (and should) read more about the technologies included in the stack before getting started (Mongo, Express, React, Node).</p>
<h2>Install</h2>
Lastly, make sure you have the following installed.
<ul>
<li>Text Editor (Atom) (or VS code/Sublime Text)</li>
<li>Latest version of Node.js (we’ll use npm, or “Node Package Manager”, to install dependencies—much like pip for Python or gems for Ruby)</li>
<li>MongoDB (quick install: install Homebrew and run brew update && brew install mongodb)</li>
<li>Postman (for API testing)</li>
<li>Prettier (to seamlessly format our Javascript; in Atom, Packages → Prettier → Toggle Format on Save to automatically format on save)</li>
Let’s get started.
  <h3Part 1: Creating our backend</h3>
  <h4>i. Initializing our project</h4>
Set the current directory to wherever you want your project to live and initialize the project using npm.
<pre><code>➜  ~ mkdir mern-auth
➜  ~ cd mern-auth
➜  mern-auth npm init
</pre></code>
<p>After running the command, a utility will walk you through creating a package.json file.
You can enter through most of these safely, but go ahead and set the entry point to server.js instead of the default index.js when prompted (can do this later in our package.json).</p>

<h3>ii. Setting up our package.json</h3>
<p>1. Set the “main” entry point to “server.js” instead of the default “index.js”, if you haven’t done so already (for conventional purposes)</p>
<p>2. Install the following dependencies using npm<p>
<pre><code>➜  mern-auth npm i bcryptjs body-parser concurrently express is-empty jsonwebtoken mongoose passport passport-jwt validator</pre></code>

<p>A brief description of each package and the function it will serve</p>
<ul>
<li>bcryptjs: used to hash passwords before we store them in our database</li>
<li>body-parser: used to parse incoming request bodies in a middleware</li>
<li>concurrently: allows us to run our backend and frontend concurrently and on different ports</li>
<li>express: sits on top of Node to make the routing, request handling, and responding easier to write</li>
<li>is-empty: global function that will come in handy when we use validator</li>
<li>jsonwebtoken: used for authorization</li>
<li>mongoose: used to interact with MongoDB</li>
<li>passport: used to authenticate requests, which it does through an extensible set of plugins known as strategies</li>
<li>passport-jwt: passport strategy for authenticating with a JSON Web Token (JWT); lets you authenticate endpoints using a JWT</li>
<li>validator: used to validate inputs (e.g. check for valid email format, confirming passwords match)</li>
  </ul>
 <h3> 3. Install the following devDependency (-D) using npm</h3>
<pre><code>➜  mern-auth npm i -D nodemon</pre></code>
<p>Nodemon is a utility that will monitor for any changes in your code and automatically restart your server, which is perfect for development. The alternative would be having to take down your server (Ctrl+C) and stand it back up every time you made a change. Not ideal.
Make sure to use nodemon instead of node when you run your code for development purposes.
  <p>
<h3>4. Change the “scripts” object to the following</h3>
<pre><code>"scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
},
</pre></code>
<p>Later on, we’ll use nodemon run server to run our dev server.
Your package.json file should look like the following at this stage.</p>
<pre><code>
{
  "name": "mern-auth",
  "version": "1.0.0",
  "description": "Mern Auth Example",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.18.3",
    "concurrently": "^4.0.1",
    "express": "^4.16.4",
    "is-empty": "^1.2.0",
    "jsonwebtoken": "^8.3.0",
    "mongoose": "^5.3.11",
    "passport": "^0.4.0",
    "passport-jwt": "^4.0.0",
    "validator": "^10.9.0"
  }
}
</pre></code>
<h3>iii. Setting up our database</h3>
<p>1. Head over to mLab and create an account if you don’t have one already.<br>
2. Create a new MongoDB Deployment
Select AWS as your cloud provider and Sandbox as your plan type. Then set your AWS region based on where you live. Finally, name your database and submit your order (don’t worry, it’s free).<br>
3. Head over to your dashboard and click on your newly created database
Navigate to the Users tab, click Add Database User, and create a database user. Your database needs at least one user in order to use it.<br>
Find your MongoDB URI; we will use this to connect to our database.
<pre><code>mongodb://<dbuser>:<dbpassword>@ds159993.mlab.com:59993/mern-auth</pre></code>
</p>
Replace <dbuser> and <dbpassword> with the database user credentials you just created.<br>
4. Create a config directory and within it a keys.js file
<pre><code>
➜  mern-auth mkdir config && cd config && touch keys.js
</pre></code>
Within your keys.js file, let’s place the following for easy access outside of this file.
<pre><code>
module.exports = {
  mongoURI: "YOUR_MONGOURI_HERE" 
};
</pre></code>
<p>
And that’s it for this file, for now.
<br>
<h3>iv. Setting up our server with Node.js and Express</h3>
The basic flow for our server setup is as follows.
<ul>
<li>Pull in our required dependencies (namely express, mongoose and bodyParser)</li>
<li>Initialize our app using express()</li>
<li>Apply the middleware function for bodyparser so we can use it</li>
<li>Pull in our MongoURI from our keys.js file and connect to our MongoDB database</li>
<li>Set the port for our server to run on and have our app listen on this port</li>
</ul>
Let’s place the following in our server.js file.</p>
<pre><code>
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
</pre></code>
<br>
Run nodemon run server and the following should output.
<pre><code>
➜  mern-auth nodemon run server
[nodemon] 1.18.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node run server server.js`
Server up and running on port 5000 !
MongoDB successfully connected
</pre></code>
Try changing the "Server up and running..." message in your file, hit save and you should see your server automatically restart.
Congratulations! You’ve set up a server using NodeJS and Express and successfully connected to your MongoDB database.
<h3>
v. Setting up our database schema</h3>
<p>Let’s create a models folder to define our user schema. Within models, create a User.js file.<p>
<pre><code>➜ mern-auth mkdir models && cd models && touch User.js</pre></code>
<p>Within User.js, we will
<ul>
<li>Pull in our required dependencies
<li>Create a Schema to represent a User, defining fields and types as objects of the Schema</li>
<li>Export the model so we can access it outside of this file</li><br>
</ul>
Let’s place the following in our User.js file.
<pre><code>
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("users", UserSchema);
</pre></code><br>
Pretty standard set up for what you would expect a user to have.
<h3>
vi. Setting up form validation</h3>
<p>Before we set up our routes, let’s create a directory for input validation and create a register.js and login.js file for each route’s validation.</p>
<pre><code>➜  mern-auth mkdir validation && cd validation && touch register.js login.js</pre></code>
<p>Our validation flow for our register.js file will go as follows:</p>
<ul>
<li>Pull in validator and is-empty dependencies</li>
<li>Export the function validateRegisterInput, which takes in data as a parameter (sent from our frontend registration form, which we’ll build in Part 2)</li>
<li>Instantiate our errors object</li>
<li>Convert all empty fields to an empty string before running validation checks (validator only works with strings)</li>
<li>Check for empty fields, valid email formats, password requirements and confirm password equality using validator functions</li>
<li>Return our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors</li>
</ul>
<br>
<p>Let’s place the following in register.js.</p>
<pre><code>
const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};
</pre></code>
<br>
<p>Our validation for our login.js follows an identical flow to the above, albeit with different fields.</p>
<pre><code>
const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
// Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};
</pre></code>

<h3>vii. Setting up our API routes</h3>
<p>Now that we have validation handled, let’s create a new folder for our api routes and create a users.js file for registration and login.<p>
<pre><code>➜ mern-auth mkdir routes && cd routes && mkdir api && cd api && touch users.js</pre></code>
<p>At the top of users.js, let’s pull in our required dependencies and load our input validations & user model.</p>
<pre><code>
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
</pre></code>

<h3>Create the Register endpoint</h3>
<p>For our register endpoint, we will</p>
<ul>
<li>Pull the <pre><code>errors</pre></code> and <pre><code>isValid</pre></code> variables from our <pre><code>validateRegisterInput(req.body)</pre></code> function and check input validation</li>
<li>If valid input, use MongoDB’s <pre><code>User.findOne()</pre></code> to see if the user already exists</li>
<li>If user is a new user, fill in the fields (name, email, password) with data sent in the body of the request</li>
<li>Use bcryptjs to hash the password before storing it in your database</li>
  </ul><br>
Let’s place the following in our users.js file for our register route.
<pre><code>
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
</pre></code>

<h3>Setup passport</h3>
<p>In your config directory, create a passport.js file.</p>
<pre><code>➜  mern-auth cd config && touch passport.js</pre></code>
Before we setup passport, let’s add the following to our keys.js file.
<pre><code>
module.exports = {
  mongoURI: "YOUR_MONGOURI_HERE",
  secretOrKey: "secret"
};
</pre></code>
<p>Back to passport.js. You can read more about the passport-jwt strategy in the link below. It does a great job breaking down how the JWT authentication strategy is constructed, explaining required parameters, variables and functions such as options, secretOrKey, jwtFromRequest, verify, and jwt_payload.</p>

<p>Let’s place the following in our passport.js file.<p>
  <pre><code>
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
</pre></code>
<p>Also, note that the jwt_payload will be sent via our login endpoint below.<br>
<h3>Create the Login endpoint</h3>
For our login endpoint, we will
<ul>
<li>Pull the errors and isValid variables from our validateLoginInput(req.body) function and check input validation</li>
<li>If valid input, use MongoDB’s User.findOne() to see if the user exists</li>
<li>If user exists, use bcryptjs to compare submitted password with hashed password in our database</li>
<li>If passwords match, create our JWT Payload</li>
<li>Sign our jwt, including our payload, keys.secretOrKey from keys.js, and setting a expiresIn time (in seconds)</li>
<li>If successful, append the token to a Bearer string (remember in our passport.js file, we setopts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();)</li>
</ul>  
<br>
Let’s place the following in our users.js file for our login route.
  <pre><code>
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});
  </pre></code>
Don’t forget to export our router at the bottom of users.js so we can use it elsewhere.
  <pre><code>
module.exports = router;
  </pre></code>
Pulling our routes into our server.js file
Make the following bolded additions to server.js.
  <pre><code>
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
<strong>const passport = require("passport");
const users = require("./routes/api/users");</strong>
const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
<strong>// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
</strong>
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
<br>
<h3>viii. Testing our API routes using Postman</h3>
<h3>Testing our Register endpoint</h3>
Open Postman and
Set the request type to POST
Set the request url to http://localhost:5000/api/users/register
Navigate to the Body tab, select x-www-form-urlencoded, fill in your registration parameters and hit Send
You should receive a HTTP status response of 200 OK and have the new user returned as JSON.

<p>Check your database on mLab and you should see a new user created with the above credentials.</p>
<h3>Testing our Login endpoint</h3>
<p>Similar to the above, in Postman
Set the request type to POST
Set the request url to http://localhost:5000/api/users/login
Navigate to the Body tab, select x-www-form-urlencoded, fill in your login parameters and hit Send
You should receive a HTTP status response of 200 OK and have the jwt returned in the response.</p>

