module.exports = function(grunt) {
    grunt.registerTask('core-build-js', [
        'clean:js',
        'jshint:core',
        'jshint:devToolBar',
        'copy:vendor',
        'build-scripts-core',
        'copy:scripts',
        'notify:coreBuilt'
    ]);
}