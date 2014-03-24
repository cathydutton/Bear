/*!
 * Bear Gruntfile
 * http://gcathydutton.co.uk
 * @author Cathy Dutton
 */

'use strict';

/**


 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};


/**
 * Grunt module
 */
module.exports = function (grunt) {

  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      build: 'build',
      css: [
        '<%= project.src %>/sass/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
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

    /**
     * Connect port/livereload
    
     */
    connect: {
      options: {
        port: 80,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'app')];
          }
        }
      }
    },

   

    /**
     * Concatenate JavaScript files
     */
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

    /**
     * Uglify (minify) JavaScript files
     */
    uglify: {
      options: {
        banner: "<%= tag.banner %>"
      },
      dist: {
        files: {
          '<%= project.build %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

    /**
     * Compile Sass/SCSS files
     */
    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.build %>/css/style.min.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'compressed',
          banner: '<%= tag.banner %>'
        },
        files: {
          '<%= project.build %>/css/style.min.css': '<%= project.css %>'
        }
      }
    },

    /**
     * Opens the web server in the browser
     */
    open: {
      server: {
        path: 'http://bear.dev'
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
        tasks: ['concat:dev']
      },
      sass: {
        files: '<%= project.src %>/sass/{,*/}*.{scss,sass}',
        tasks: ['sass:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '{,*/}*.html',
          '<%= project.build %>/css/*.css',
          '<%= project.build %>/js/{,*/}*.js',
          '<%= project.build %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'sass:dev',
    'concat:dev',
    'open',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'sass:dist',
    'uglify'
  ]);

};
