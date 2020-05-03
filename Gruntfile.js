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
                    './dist/coreform.builder.js': [
                        "./src/js/vue.min.js",
                        "./src/js/jquery.min.js",
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
                        "./src/js/editfieldmodal.js",
                        "./src/js/component_builder_helpers.js",
                        "./src/js/components.js",
                        "./src/js/script_builder.js"
                    ],
                    './dist/coreform.renderer.js': [
                        "./src/js/vue.min.js",
                        "./src/js/jquery.min.js",
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
    });
    grunt.registerTask('build-dist', ['sass:dist', 'cssmin:target','terser:js']);
    grunt.loadNpmTasks("grunt-terser");
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};