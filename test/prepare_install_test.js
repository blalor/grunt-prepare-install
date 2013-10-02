/* jshint -W030 */ // for ".to.be.empty;"
"use strict";

var expect = require("chai").expect;
var assert = require("chai").assert;
var _      = require("lodash");
var fs     = require("fs");
var path   = require("path");

var temp = require("temp");
temp.track();

// http://stackoverflow.com/a/14801711/53051
/**
 * Removes a module from the cache
 */
require.uncache = function (moduleName) {
    // Run over the cache looking for the files
    // loaded by the specified module name
    require.searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });
};

/**
 * Runs over the cache to search for all the cached
 * files
 */
require.searchCache = function (moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and
            // run over it
            mod.children.forEach(function (child) {
                run(child);
            });

            // Call the specified callback providing the
            // found module
            callback(mod);
        })(mod);
    }
};


// tests need to run after prepare_install task in Gruntfile.js for this
// project.  Kludgy, but it'll work for now…
describe("grunt-prepare-install", function() {
    // wikked long timeout
    this.timeout(120000);
    
    // shared cache dir, to speed up downloads
    var npmCacheDir = path.join(path.resolve(), "tmp/npm-cache");
    
    var pkgJson;
    var installBase;
    var grunt;
    
    beforeEach(function() {
        grunt = require("grunt");
        pkgJson = grunt.file.readJSON("package.json");

        // Actually load this plugin"s task(s).
        grunt.loadTasks("tasks");
        
        // Project configuration.
        grunt.initConfig({
            prepare_install: {
                options: {
                    tmpDir: temp.mkdirSync(),
                    cacheDir: npmCacheDir,
                    installPrefix: "/usr/local"
                }
            }
        });
        
        // the root of the installed module
        installBase = path.join(
            grunt.config.get("prepare_install.options.tmpDir"),
            "package-root",
            grunt.config.get("prepare_install.options.installPrefix"),
            "lib/node_modules/grunt-prepare-install"
        );
    });
    
    afterEach(function() {
        grunt = null;
        require.uncache("grunt");
        require.uncache("npm");
    });

    it("installs to configured path", function(done) {
        grunt.task.run("prepare_install");
        
        grunt.task.options({
            done: function() {
                assert(grunt.file.exists(installBase));
                assert(grunt.file.exists(installBase, "node_modules"));
                
                done();
            }
        });
        
        grunt.task.start();
    });
    
    it("only installs runtime dependencies", function(done) {
        grunt.task.run("prepare_install");
        
        grunt.task.options({
            done: function() {
                // find all installed modules by reading all entries in the node_modules
                // directory and removing ., .., and .bin.
                var installedDeps = _.difference(
                    fs.readdirSync(path.join(installBase, "node_modules")),
                    [ ".", "..", ".bin" ]
                );
                
                expect(_.difference(
                    Object.keys(pkgJson.dependencies),
                    installedDeps
                )).to.be.empty;
                
                done();
            }
        });
        
        grunt.task.start();
    });
});
