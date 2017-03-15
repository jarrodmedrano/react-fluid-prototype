module.exports = function (grunt) {
    grunt.registerTask('staging-ticket', 'Set tickets to ticket number.', function (ticket) {
        var layouts = [],
            partnerConfigPath = "partners/",
            partnerConfigFiles = grunt.file.expand({ cwd: partnerConfigPath }, "**/config.json"),
            coreConfigPath = "core/",
            coreConfigFile = grunt.file.readJSON('core/config.json'),
            ticket_regex = /ticket: (.*)/;

        // check for config files in core and root of all partners
        layouts.push(coreConfigPath + coreConfigFile.layout);
        for (var i = 0; i < partnerConfigFiles.length; i++) {
            var partnerConfig = grunt.file.readJSON(partnerConfigPath + partnerConfigFiles[i]);
            if (partnerConfig.layout !== undefined) {
                layouts.push(partnerConfigPath + partnerConfigFiles[i].split('/')[0] + '/' + partnerConfig.layout);
            }
        }

        if (ticket !== null && ticket !== undefined) {
            // set the ticket # for the base layout
            for (var m = 0; m < layouts.length; m++) {
                var base = grunt.file.read(layouts[m]);
                base = base.replace(ticket_regex, "ticket: /tickets/" + ticket);
                grunt.file.write(layouts[m], base);
            }
        }
    });
}