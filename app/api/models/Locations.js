/**
* Locations.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  types:{
    isGeoJsonPoint: function(geoJson){
      return geoJson.type === "point" &&
      Array.isArray(geoJson.coordinates) &&
      geoJson.coordinates.length === 2 &&
      typeof(geoJson.coordinates[0]) === "number" && 
      typeof(geoJson.coordinates[0])  === typeof(geoJson.coordinates[1]);
    }
  },
  attributes: {
    coordinates:{
      type:'json',
      isGeoJsonPoint: true
    },
    listing:{
      model:'listings'
    }
  }
};

