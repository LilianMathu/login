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
Prerequisites
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
iv. Setting up our server with Node.js and Express
The basic flow for our server setup is as follows.
Pull in our required dependencies (namely express, mongoose and bodyParser)
Initialize our app using express()
Apply the middleware function for bodyparser so we can use it
Pull in our MongoURI from our keys.js file and connect to our MongoDB database
Set the port for our server to run on and have our app listen on this port
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
<p>Within User.js, we will<
Pull in our required dependencies
<li>Create a Schema to represent a User, defining fields and types as objects of the Schema</li>
<li>Export the model so we can access it outside of this file</li><br>
Let’s place the following in our User.js file.

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
Pretty standard set up for what you would expect a user to have.
