const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//load input validation
const validateRegisterInput = require('../../validation/register');
const  validateLoginInput = require('../../validation/login');

//load user model
const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public

router.post('/register', (req, res)=> {
    //form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //If valid input, use MongoDB’s User.findOne() to see if the user already exists
    User.findOne({ email: req.body.email})
        .then(user=> {
            if(user){
                return res.status(400).json({ email: "email already exist"});
            } else {
                const newUser = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                //hash passwords before saving in the db
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user=>res.json(user))
                        .catch(err=>console.log(err));
                    });
                });
            }
        });
});