/*
 * grunt-prepare-install
 * https://github.com/blalor/grunt-prepare-install
 *
 * Copyright (c) 2013 Brian Lalor
 * Licensed under the WTFPL license.
 */

"use strict";

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                "Gruntfile.js",
                "tasks/*.js",
                "<%= mochaTest.test.src %>",
            ],
            options: {
                jshintrc: ".jshintrc",
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ["tmp"],
        },

        // Configuration to be run (and then tested).
        prepare_install: {
            options: {
                installPrefix: "/usr/local"
            }
        },

        // Unit tests
        mochaTest: {
            test: {
                src: [ "test/**/*.js" ]
            }
        }
    });

    // Actually load this plugin"s task(s).
    grunt.loadTasks("tasks");

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-mocha-test");

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin"s task(s), then test the result.
    grunt.registerTask("test", ["clean", "prepare_install", "mochaTest"]);

    // By default, lint and run all tests.
    grunt.registerTask("default", ["jshint", "test"]);
};
