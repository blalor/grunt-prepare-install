/* jshint -W030 */ // for ".to.be.empty;"
"use strict";

var expect = require("chai").expect;
var assert = require("chai").assert;
var grunt  = require("grunt");
var _      = require("lodash");
var fs     = require("fs");
var path   = require("path");

// tests need to run after prepare_install task in Gruntfile.js for this
// project.  Kludgy, but it'll work for now…
describe("grunt-prepare-install", function() {
    var pkgJson;
    var gruntfile;
    var installBase;
    
    before(function() {
        pkgJson = grunt.file.readJSON("package.json");
        
        gruntfile = require("../Gruntfile")(grunt);
        
        // the root of the installed module
        installBase = path.join(
            "tmp/package-root",
            grunt.config.get("prepare_install.options.installPrefix"),
            "lib/node_modules/grunt-prepare-install"
        );
    });

    it("installs to configured path", function() {
        assert(grunt.file.exists(installBase));
        assert(grunt.file.exists(installBase, "node_modules"));
    });
    
    it("only installs runtime dependencies", function() {
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
    });
});
