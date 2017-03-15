module.exports = function(grunt) {
    grunt.registerTask('force-on', 'turns the --force option ON', function () {
        if (!grunt.option('force')) {
            grunt.config.set('forceStatus', true);
            grunt.option('force', true);
        }
    });
}