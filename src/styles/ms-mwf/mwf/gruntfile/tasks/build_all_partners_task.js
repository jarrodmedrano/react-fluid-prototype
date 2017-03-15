module.exports = function(grunt) {
    grunt.registerTask('build-all-partners', 'Builds all partners whose config specifies build:true', function(){
        var configPath = "partners/";
        var configFiles = grunt.file.expand({cwd: configPath}, "**/config.json");
        var partners = [];
        
        // read all partner config files, check for "build": true
        for (var i = 0; i < configFiles.length; i++) {
            var configData = grunt.file.readJSON(configPath + configFiles[i]);

            // build only if we want to build.
            // if the Partner is configured to not go to CDN, then avoid building in the release option
            if (configData.build && !(grunt.option('release') && configData.deployToCDN === false)) {

                // we have the go-ahead to build!
                grunt.task.run('build-partner:' + configFiles[i].split('/')[0]);

                if (configData.buildIndex)
                    grunt.task.run('assemble:buildPartnerIndex');
            } else {
                console.log('Skipping Partner build: ' + configFiles[i].split('/')[0]);
            }
        }
    });
}