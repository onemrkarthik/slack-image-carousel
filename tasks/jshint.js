'use strict';


module.exports = function jshint(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Options
    return {
        files: [
            'src/modules/**/*.js',
            'src/pages/**/*.js',
            'src/services/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    };
};
