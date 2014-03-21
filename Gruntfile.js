/*!
 * Bear Gruntfile
 * http://www.cathydutton.co.uk
 * @author Cathy Dutton
 */

'use strict';


 var secret = {};
  try {
    secret = grunt.file.readJSON('secret.json');
  } catch (err) {}

module.exports = function (grunt) {

  grunt.initConfig({
 
    pkg: grunt.file.readJSON('package.json'),
   


 // Set up project files
 
    project: {
      src: 'src',
      build: 'build',
      server: 'test.dev',
      css: [
        '<%= project.src %>/scss/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

   
    //  Project banner
    
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },

    // Project configuration.
grunt.initConfig({
  connect: {
    server: {
      options: {
        port: 800,
        base: '/'
      }
    }
  }
});

    
   // Clean files and folders
   
    clean: {
      build: [
        '<%= project.build %>/css/style.unprefixed.css',
        '<%= project.build %>/css/style.prefixed.css'
      ]
    },


     // JSHint
    jshint: {
      files: [
        'src/js/*.js',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

   
     // Concatenate JavaScript files
     
    concat: {
      dev: {
        files: {
          '<%= project.build %>/js/scripts.min.js': '<%= project.js %>'
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },

    
     // Uglify (minify) JavaScript files
    
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      },
      build: {
        files: {
          '<%= project.build %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

 
     // Compile Sass/SCSS files
    
    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.build %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      },
      build: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.build %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      }
    },

  
     // Autoprefixer
    
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          'safari 6',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dev: {
        files: {
          '<%= project.build %>/css/style.min.css': ['<%= project.build %>/css/style.unprefixed.css']
        }
      },
      build: {
        files: {
          '<%= project.build %>/css/style.prefixed.css': ['<%= project.build %>/css/style.unprefixed.css']
        }
      }
    },

   
    // CSS minification
    
    cssmin: {
      dev: {
        options: {
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.build %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.build %>/css/style.unprefixed.css'
          ]
        }
      },
      build: {
        options: {
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.build %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.build %>/css/style.prefixed.css'
          ]
        }
      }
    },



   
    // Open web server 
    open: {
      server: {
        path: 'http://<%= project.server %>'
      }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      concat: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['concat:dev', 'jshint']
      },
      sass: {
        files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev', 'cssmin:dev', 'autoprefixer:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '/{,*/}*.html',
          '<%= project.build %>/css/*.css',
          '<%= project.build %>/js/{,*/}*.js',
          '<%= project.build %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

// Upload
secret: grunt.file.readJSON('secret.json'),
sftp: {
  test: {
    files: {
      "./": "*json"
    },
    options: {
      path: '/tmp/',
      host: '<%= secret.host %>',
      username: '<%= secret.username %>',
      password: '<%= secret.password %>',
      showProgress: true
    }
  }
},
sshexec: {
  test: {
    command: 'uptime',
    options: {
      host: '<%= secret.host %>',
      username: '<%= secret.username %>',
      password: '<%= secret.password %>'
    }
  }
}

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'sass:dev',
    'cssmin:dev',
    'autoprefixer:dev',
    'jshint',
    'concat:dev',
    'connect:livereload',
    'open',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'sass:build',
    'autoprefixer:build',
    'cssmin:build',
    'clean:build',
    'jshint',
    'uglify'
  ]);

   grunt.registerTask('production', [
  'sftp:test',
  'sshexec:test'
  ]);

};
