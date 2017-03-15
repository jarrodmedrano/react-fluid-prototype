module.exports = function(grunt) {
    /**
     * cdn-deploy-manifests
     * 
     * This task is for only deploying the manifest files to the CDN.
     * This only requires a clean dist folder and the manifest files copied to the correct
     * locations.
     */
    grunt.registerTask('cdn-deploy-manifests', function () {
        grunt.task.run('clean:dist');
        grunt.task.run('copy:cdnmanifests');
    });
}