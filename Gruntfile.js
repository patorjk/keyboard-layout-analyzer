module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        clean: [
            './js/build/*'
        ],

        concat: {
            build: {
                files: {
                    './js/build/services.js': './js/services/*.js',
                    './js/build/controllers.js': './js/controllers/*.js',
                    './js/build/directives.js': './js/directives/*.js',
                    './js/build/filters.js': './js/filters/*.js',
                }
            }
        },

        ngtemplates:    {
            app: {
                src:        ['partials/*.htm'],
                dest:       './js/build/templates.js',
                options:    {
                    module: 'kla'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    './js/build/services.js': './js/build/services.min.js',
                    './js/build/controllers.js': './js/build/controllers.min.js',
                    './js/build/directives.js': './js/build/directives.min.js',
                    './js/build/filters.js': './js/build/filters.min.js'
                }
            }
        },

        jshint: {
            options: {
            },
            files: [
                './js/**/*.js'
            ]
        },

        sloc: {
            app: {
                files: {
                    './': [ 'js/build/*.js' ],
                    './js': [ 'app.js' ]
                }
            }
        },

        watch: {
            scripts: {
                files: [
                    './js/services/*.js',
                    './js/controllers/*.js',
                    './js/directives/*.js',
                    './js/filters/*.js',
                    './partials/*.htm'
                ],
                tasks: ['default'],
                options: {
                    interrupt: true,
                },
            },
        },

        ngdocs: {
            options: {
                dest: './docs',
                scripts: ['angular.js'],
                html5Mode: false,
                title: 'Docs',
            },
            app: {
                src: [
                    'js/controllers/*.js',
                    'js/directives/*.js',
                    'js/services/*.js',
                    'js/filters/*.js',
                ],
                title: 'KLA'
            },
        },

        docular: {
            groups: [{
                id: "api",
                title:"Angular API",
                scripts: [
                    'js/directives/navbar-link.js',
                ]
            }],
            docular_partial_home: 'home.html',
            docular_partial_navigation: 'navigation.html',
            docular_webapp_target: 'docs',
            showDocularDocs: true,
            showAngularDocs: true
        },

        finished: {
            app: {}
        }

    });

    grunt.registerMultiTask('finished', function() {
        grunt.log.writeln('Type "grunt sloc" to get a report on the number of source code lines.');
        grunt.log.writeln('Type "grunt jshint" to get a report on the JavaScript code.');
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-sloc');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-docular');

    // Default task(s).
    grunt.registerTask('docs', ['ngdocs']);
    grunt.registerTask('default', ['clean', 'concat', 'ngtemplates', 'uglify', 'finished']);
    

};