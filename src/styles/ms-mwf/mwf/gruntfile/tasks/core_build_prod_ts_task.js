module.exports = function(grunt) {
    grunt.registerTask('core-build-prod-ts', [
        'exec:ts-core-prod',
        'exec:ts-core-bundle-debug',
        'exec:ts-core-bundle-release'
    ]);
}