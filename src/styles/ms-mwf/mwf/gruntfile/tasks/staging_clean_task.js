module.exports = function (grunt) {
    grunt.registerTask('staging-clean', 'Reset tickets to false.', function () {
        var ticketID = grunt.option('ticket') || undefined,
            layouts = [],
            partnerConfigPath = "partners/",
            partnerConfigFiles = grunt.file.expand({ cwd: partnerConfigPath }, "**/config.json"),
            coreConfigPath = "core/",
            coreConfigFile = grunt.file.readJSON('core/config.json'),
            ticket_regex = /ticket: (.*)/;

        function cleanTicketIDs(layoutFiles, regex) {
            for (var k = 0; k < layoutFiles.length; k++) {
                var base = grunt.file.read(layoutFiles[k]);
                base = base.replace(regex, "ticket: false");
                grunt.file.write(layoutFiles[k], base);
            }
        }

        // check for config files in core and root of all partners
        layouts.push(coreConfigPath + coreConfigFile.layout);
        for (var i = 0; i < partnerConfigFiles.length; i++) {
            var partnerConfig = grunt.file.readJSON(partnerConfigPath + partnerConfigFiles[i]);
            if (partnerConfig.layout !== undefined) {
                layouts.push(partnerConfigPath + partnerConfigFiles[i].split('/')[0] + '/' + partnerConfig.layout);
            }
        }

        // clean layout tickets
        cleanTicketIDs(layouts, ticket_regex);
    });
}