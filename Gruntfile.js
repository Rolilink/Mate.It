module.exports = function(grunt){
  grunt.initConfig({
    clean:{
      build:{
        src: ['public/css/**.*','!public/css/bootstrap.min.css','!public/css/bootflat.min.css']
      }
    },
    stylus:{
      build:{
        options: {
          linenos: true,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'stylesheets',
          src: [ '**/*.styl' ],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'public/css',
        src: [ '**/*.css' ],
        dest: 'public/css'
      }
    },
    watch:{
      stylesheets:{
        files:'stylesheets/*.styl',
        tasks: ['stylesheets:build']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['specs/**/*.js']
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  
  grunt.registerTask('test','mochaTest');
  grunt.registerTask('stylesheets:build','compile the stylesheets.',['stylus:build','autoprefixer:build']);
  grunt.registerTask('build','Compiles all the assets and copies the files to build',['clean:build','stylesheets:build']);
  grunt.registerTask('default','Watches the project for change, compile jade files and stylus files',['build','watch']);
}