const Validator = require('validator');
const isEmpty = require('is-empty');

//export the function which takes a parameter of data sent from our frontend registration form

module.exports = function validateRegisterInput(data) {

    // Instantiate our errors object
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    //validate name
    if(Validator.isEmpty(data.name)) {
        errors.name = 'name is required';
    }

    //validate email
    if(Validator.isEmpty(data.email)){
        errors.email= 'email is required';
    } else if(!Validator.isEmail(data.email)){
        errors.email = 'email is invalid';
    }

    //validate password
    if(Validator.isEmpty(data.password)){
        errors.password= 'password field is required';
    }

    //validate passowrd2
    if(Validator.isEmpty(data.password2)){
        errors.password2= 'confirm password field is required';
    }

    if(!Validator.isLength(data.password, { min:6, max:30 })){
        errors.password= 'password must be at least six characters'
    }
    if(!Validator.equals(data.password, data.password2)) {
        errors.password2= "passwords must match";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    };

};