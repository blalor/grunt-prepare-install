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
                "test/**/*.js",
            ],
            options: {
                jshintrc: ".jshintrc",
            },
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-jshint");


    grunt.registerTask("mochaTest", "runs mocha in a child process", function() {
        var done = this.async();
        
        // spawn a child process to run mocha, and send the output to our own
        // stdio.
        grunt.util.spawn({
            cmd: "node_modules/.bin/mocha",
            opts: {
                stdio: [ null, process.stdout, process.stderr ]
            }
        }, function(err /* , result, code */) {
            done(err);
        });
    });
    
    // By default, lint and run all tests.
    grunt.registerTask("test", ["jshint", "mochaTest"]);
};
