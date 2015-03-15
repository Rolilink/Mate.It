/**
 * Run Mocha tests.
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to run the tests located in /test directory.
 *
**/

module.exports = function(grunt) {

  grunt.config.set('mochaTest', {
    test:{
      options: {
          reporter: 'spec'
        },
        src: ['tests/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
};
