module.exports = function(grunt) {
    grunt.registerTask('staging-deploy-images', [
        'staging-images',
        'sftp-deploy:dist',
        'notify:stagingDeployedImages'
    ]);
}