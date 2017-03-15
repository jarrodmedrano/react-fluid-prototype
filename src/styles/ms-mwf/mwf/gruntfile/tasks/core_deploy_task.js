module.exports = function(grunt) {
    grunt.registerTask('core-deploy', [
        'clean-dist-temp',
        'build-core',
        'sftp-deploy:dist',
        'notify:coreDeployed'
    ]);
}