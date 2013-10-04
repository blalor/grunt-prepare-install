/*
 * grunt-prepare-install
 * https://github.com/blalor/grunt-prepare-install
 *
 * Copyright (c) 2013 Brian Lalor
 * Licensed under the WTFPL license.
 */

"use strict";

var path   = require("path");
var Q      = require("q");
var rimraf = require("rimraf");

module.exports = function(grunt) {

    // stolen almost verbatim from grunt-contrib-clean
    function clean(filepath) {
        if (! grunt.file.exists(filepath)) {
            return false;
        }

        grunt.log.write("Cleaning " + filepath + " … ");

        if (grunt.file.isPathCwd(filepath)) {
            grunt.verbose.error();
            grunt.fail.warn("Cannot delete the current working directory.");
            
            return false;
        } else if (! grunt.file.isPathInCwd(filepath)) {
            grunt.verbose.error();
            grunt.fail.warn("Cannot delete files outside the current working directory.");
            
            return false;
        }

        try {
            rimraf.sync(filepath);
            
            grunt.log.ok();
        } catch (e) {
            grunt.log.error();
            grunt.fail.warn("Unable to delete '" + filepath + "' file (" + e.message + ").", e);
        }
    }
    
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
        
        // https://npmjs.org/doc/misc/npm-config.html#ignore
        var ignorePaths = [
            "node_modules", // definitely don't want this
        ];
        
        // add the portions of the temporary directory paths that exist under
        // the project root (if it exists) to ignorePaths
        [ opts.cacheDir, opts.packageRoot ].forEach(function(d) {
            if (d.indexOf(path.resolve()) === 0) {
                ignorePaths.push(d.substr(path.resolve().length + 1));
            }
        });
        
        // https://npmjs.org/doc/misc/npm-config.html
        var npmOpts = {
            production: true,
            "engine-strict": opts.npm.engineStrict,
            cache: opts.cacheDir,
            prefix: path.join(opts.packageRoot, opts.installPrefix),
            ignore: ignorePaths.join(" "),
            global: true,
            loglevel: "warn"
        };
        
        clean(opts.packageRoot);
        
        var done = this.async();
        
        grunt.verbose.writeflags(npmOpts, "npm options");
        
        
        // despite loglevel: "warn" we still get a summary of what was
        // installed, plus gyp (?) output
        Q.ninvoke(require("npm"), "load", npmOpts).then(function(npm) {
            // npm install $PWD
            grunt.log.writeln("Installing module");
            
            return Q.ninvoke(npm.commands, "install", [ path.resolve() ]);
        }).done(function() {
            grunt.log.ok();

            done();
        }, function(err) {
            grunt.log.error();
            grunt.fail.warn("npm install failed: " + err.message, err);

            done(err);
        });
    });
};
