const sass = require('node-sass');

module.exports = function (grunt) {
    grunt.initConfig({
        'sass': {                              // Task
                                       // Target
              options: {                       // Target options
                implementation: sass,
                sourceMap: true
              },
              dist: { 
                files: {                         // Dictionary of files
                    './dist/coreform.builder.css': './src/css/builder.scss',       // 'destination': 'source'
                    './dist/coreform.renderer.css': './src/css/renderer.scss'       // 'destination': 'source'
                }
            
            }
          },
          cssmin: {
            options: {
              mergeIntoShorthands: false,
              roundingPrecision: -1
            },
            target: {
              files: {
                './dist/coreform.renderer.min.css': ['./dist/coreform.renderer.css'],
                './dist/coreform.builder.min.css': ['./dist/coreform.builder.css'],
              }
            }
          },
        'terser': {
            js: {
                files: {
                    './dist/coreform.builder.min.js': [
                        "./src/js/uikit.js",
                        "./src/js/uikit-icons.js",
                        "./src/js/vuelidate.min.js",
                        "./src/js/validators.min.js",
                        "./src/js/select2.js",
                        "./src/js/quill.min.js",
                        "./src/js/moment.min.js",
                        "./src/js/daterangepicker.js",
                        "./src/js/sortable.min.js",
                        "./src/js/script_common.js",
                        "./src/js/component_builder_helpers.js",
                        "./src/js/components.js",
                        "./src/js/editfieldmodal.js",
                        "./src/js/editvariablemodal.js",
                        "./src/js/variablesTable.js",
                        "./src/js/script_builder.js"
                    ],
                    './dist/coreform.renderer.min.js': [
                        "./src/js/uikit.js",
                        "./src/js/uikit-icons.js",
                        "./src/js/vuelidate.min.js",
                        "./src/js/validators.min.js",
                        "./src/js/select2.js",
                        "./src/js/quill.min.js",
                        "./src/js/moment.min.js",
                        "./src/js/daterangepicker.js",
                        "./src/js/script_common.js",
                        "./src/js/component_renderer_helpers.js",
                        "./src/js/components.js",
                        "./src/js/script_renderer.js"
                    ]
                }
            }
        },
        remove_comments: {
          js: {
            options: {
              multiline: true,
              singleline: true,
              keepSpecialComments: false
            },
            cwd: './dist/',
            src: '*.js',
            expand: false,
            dest: 'dist/'
          },
          css: {
            options: {
              multiline: true,
              singleline: true,
              keepSpecialComments: false,
              linein: true,
              isCssLinein: true
            },
            cwd: './dist/',
            src: '*.css',
            expand: true,
            dest: 'dist/'
          }
        },
        svgcss: {
          defaultOptions: {
            files: {
              './src/css/sprites.css': ['./src/img/*.svg']
            }
          }
        }
    });
    grunt.loadNpmTasks("grunt-terser");
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-remove-comments');
    grunt.loadNpmTasks('grunt-svg-css');
    grunt.registerTask('build-dev', ['svgcss:defaultOptions', 'sass:dist']);
    grunt.registerTask('build-dist', ['svgcss:defaultOptions', 'sass:dist', 'cssmin:target','terser:js','remove_comments:js','remove_comments:css']);

};