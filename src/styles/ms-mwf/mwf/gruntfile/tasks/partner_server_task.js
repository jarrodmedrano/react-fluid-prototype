module.exports = function(grunt) {
    grunt.registerTask('partner-server', 'Run a local development server for all partners', [
        'clean-dist-temp',
        'build-all-partners',
        'build-core',
        'connect:default',
        'notify:partnerStarted',
        'watch:partnersAll'
    ]);
}