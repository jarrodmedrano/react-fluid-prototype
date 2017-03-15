module.exports = function(grunt) {
    grunt.registerTask('staging-images', [
        'clean-dist-temp',
        'copy:stagingImages'
    ]);
}