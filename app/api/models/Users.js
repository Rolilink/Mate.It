/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      email: true
    },
    about: 'string',
    birthdate: 'date',
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    profilePicture: 'string',
    role: 'string',
    listing: 'string'
  }
};

