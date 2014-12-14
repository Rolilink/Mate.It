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
      },
      jade:{
        files:'views/templates/*.jade',
        tasks: ['jade:build']
      }
    },
    mochaTest: {
      acceptance: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['tests/index.js','tests/acceptance/**/*.js']
      },
      unit: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['tests/index.js','tests/unit/**/*.js']
      },
      integration: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['tests/index.js','tests/integration/**/*.js']
      }
    },
    jade: {
      build:{
        options:{
          amd:true,
          client:true,
          namespace:false
        },
        files: [{
          expand: true,
          cwd: 'views/templates/',
          src: [ '*.jade' ],
          dest: 'public/js/app/templates',
          ext: '.js'
        }]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-mocha-test');
  
  grunt.registerTask('test',['mochaTest:acceptance','mochaTest:unit','mochaTest:integration']);
  grunt.registerTask('test:unit','mochaTest:unit');
  grunt.registerTask('test:acceptance','mochaTest:acceptance');
  grunt.registerTask('test:integration','mochaTest:integration');
  grunt.registerTask('stylesheets:build','compile the stylesheets.',['stylus:build','autoprefixer:build']);
  grunt.registerTask('build','Compiles all the assets and copies the files to build',['clean:build','stylesheets:build','jade:build']);
  grunt.registerTask('default','Watches the project for change, compile jade files and stylus files',['build','watch']);
}