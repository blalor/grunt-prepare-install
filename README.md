# grunt-prepare-install [![Build Status](https://travis-ci.org/blalor/grunt-prepare-install.png?branch=master)](https://travis-ci.org/blalor/grunt-prepare-install)

> Install runtime dependencies to prepare for packaging.

Equivalent to running

    cd /my/target/dir && npm install $OLDPWD

This is useful if you want to create a binary tarball or system package (rpm,
deb) of your package for great installation sanity.  Because you really don't
want to be downloading from untrusted sources on your production servers, do
you?  Of course you don't.

## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

    npm install grunt-prepare-install --save-dev

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

    grunt.loadNpmTasks("grunt-prepare-install");


## The "prepare_install" task

### Overview

In your project's Gruntfile, add a section named `prepare_install` to the data
object passed into `grunt.initConfig()`.

    grunt.initConfig({
        prepare_install: {
            options: {
                // options go here.
            }
        },
    })

### Options

#### options.tmpDir

Type: `String`
Default value: `"tmp"`

Path to a scratch directory.

#### options.packageRoot

Type: `String`
Default value: `tmpDir + "/package-root"`

The base directory where the module is installed.

#### options.cacheDir

Type: `String`
Default value: `tmpDir + "/npm-cache"`

Where the npm cache is stored.  This should be separate from your user- or system-wide cache, to work around dependency resolution problems with npm.

#### options.installPrefix

Type: `String`
Default value: `"."`

Path under `packageRoot` where the module will be installed.  For example, if you use `/usr/local`, your module will be installed to `/usr/local/lib/node_modules/my-module` and any binaries (as configured in your `package.json`) will be put in `/usr/local/bin`.

### Usage Example

This will install your module into `tmp/package-root/usr/local`.

  grunt.initConfig({
      prepare_install: {
          options: {
              installPrefix: "/usr/local"
          }
      },
  })

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using `npm test`.

## Release History

_(Nothing yet)_
