module.exports = function (grunt) {
grunt.initConfig({
    buildcontrol: {
            options: {
                dir: 'build',
                commit: true,
                push: true,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            sitebox: {
                options: {
                    remote: 'https://v-jamedr@rdx-vertical.scm.sitebox-s.redant.selfhost.corp.microsoft.com:443/RDX-VERTICAL.git',
                    branch: 'master'
                }
            }
        }
});

grunt.loadNpmTasks('grunt-build-control');

grunt.registerTask('deploy', ['buildcontrol:sitebox']);

};
