module.exports = function(grunt) {
    grunt.registerTask('force-off', 'turns the --force option OFF', function () {
        if (grunt.option('force')) {
            grunt.config.set('forceStatus', false);
            grunt.option('force', false);
        }
    });
}