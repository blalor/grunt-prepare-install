/*
 * grunt-prepare-install
 * https://github.com/blalor/grunt-prepare-install
 *
 * Copyright (c) 2013 Brian Lalor
 * Licensed under the WTFPL license.
 */

"use strict";

var path = require("path");
var Q    = require("q");

module.exports = function(grunt) {

    // run "npm install $PWD".  This will be our install package, with full
    // binary modules.
    grunt.registerTask("prepare_install", "npm install", function() {
        var defaultOpts = {
            tmpDir: path.resolve("tmp"),
            installPrefix: ".",
        };
        
        // the root of the installation
        defaultOpts.packageRoot = path.join(defaultOpts.tmpDir, "package-root");

        // tell npm where to stuff the cache, and for the root of our install
        defaultOpts.cacheDir = path.join(defaultOpts.tmpDir, "npm-cache");
        
        var opts = this.options(defaultOpts);
        
        var done = this.async();
        
        // despite loglevel: "warn" we still get a summary of what was
        // installed, plus gyp (?) output
        Q.ninvoke(require("npm"), "load", {
            production: true,
            "engine-strict": true,
            cache: opts.cacheDir,
            prefix: path.join(opts.packageRoot, opts.installPrefix),
            global: true,
            loglevel: "warn"
        }).then(function(npm) {
            // npm install $PWD
            return Q.ninvoke(npm.commands, "install", [ path.resolve() ]);
        }).done(done, done);
    });
};
