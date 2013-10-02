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
            npm: {
                engineStrict: false
            }
        };
        
        var opts = this.options(defaultOpts);
        
        // tell npm where to stuff the cache, and for the root of our install
        if (! opts.cacheDir) {
            opts.cacheDir = path.join(opts.tmpDir, "npm-cache");
        }
        
        // the root of the installation
        if (! opts.packageRoot) {
            opts.packageRoot = path.join(opts.tmpDir, "package-root");
        }
        
        var done = this.async();
        
        // despite loglevel: "warn" we still get a summary of what was
        // installed, plus gyp (?) output
        Q.ninvoke(require("npm"), "load", {
            production: true,
            "engine-strict": opts.npm.engineStrict,
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
