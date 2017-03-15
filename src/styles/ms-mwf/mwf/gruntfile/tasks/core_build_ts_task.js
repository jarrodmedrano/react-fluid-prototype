module.exports = function(grunt) {
    grunt.registerTask('core-build-ts', [
        'clean:tsTests',
        'exec:ts-core-debug',
        'exec:ts-var-bundle-debug'
    ]);
}