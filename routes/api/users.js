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