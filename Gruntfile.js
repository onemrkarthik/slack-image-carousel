'use strict';


module.exports = function(grunt) {
    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    grunt.registerTask('lint', ['jscs', 'jshint']);
    grunt.registerTask('test', ['karma:test']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.event.on('coverage', function (content, done) {
        done();
    });
};
