module.exports = function (grunt) {
    grunt.registerTask('staging-deploy', 'Run deployment to staging environment. Option to set a ticket to deploy to the review staging server eg. grunt staging-deploy --ticket=123456', function (v) {
        var ticketID = grunt.option('ticket') || undefined,
            flags = grunt.option.flags(),
            matchTicket;

        for (var i = 0; i < flags.length; i++) {
            if (flags[i] !== undefined && flags[i].includes('ticket')) {
                matchTicket = flags[i].includes('ticket') || undefined;
                break;
            } else {
                matchTicket = undefined;
            }
        }

        if (v !== null && v !== undefined) grunt.task.run('generate-changelogs:' + v);

        if (ticketID === true) {
            grunt.log.error('Provide a ticket ID.');
            grunt.fail.fatal('Format your ticket-specific staging deployment as "grunt staging-deploy --ticket=123456" where 123456 is your ticket id.');
        }

        if (ticketID !== null && ticketID !== undefined) {
            grunt.task.run('clean-dist-temp', 'staging-ticket:' + ticketID, 'staging', 'staging-clean', 'staging-deploy-ticket:' + ticketID, 'notify:stagingDeployed');
        } else {
            var taskList = ['staging-clean', 'staging', 'sftp-deploy:dist', 'notify:stagingDeployed'];

            grunt.task.run(taskList);
        }
    });
}