'use strict';

module.exports = function jscs(grunt) {
    grunt.loadNpmTasks('grunt-jscs');

    return {
        src: [
            "src/**/modules/**/*.js",
            // "src/**/pages/**/*.js",
            "src/**/services/**/*.js"
        ],
        options: {
            config: ".jscsrc",
            esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
            verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
            requireCurlyBraces: [ "if" ]
        }
    };
};