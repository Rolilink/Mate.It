/**
* Listings.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    capacity: {
      type: 'integer',
      required: true
    },
    listed: {
      type: 'boolean',
      defaultsTo: true
    },
    address: 'string',
    price: {
      type: 'float',
      required: true
    },
    roomType: {
      type: 'string',
      defaultsTo: 'private',
      in: [
        'private',
        'shared'
      ]
    },
    propertyType: {
      type: 'string',
      defaultsTo: 'apartment',
      in: [
        'apartment',
        'house'
      ]
    },
    description: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    genderAllowed: {
      type: 'string',
      defaultsTo: 'both',
      in: [
        'both',
        'male',
        'female'
      ]
    },
    amenities: {
      type: 'array',
      in: [
        'kitchen',
        'internet',
        'tv',
        'wifi',
        'air_conditioning',
        'washer',
        'dryer',
        'cable_tv',
        'pets_allowed',
        'gym',
        'pool',
        'smoking_allowed'
      ]
    }
  }
};

