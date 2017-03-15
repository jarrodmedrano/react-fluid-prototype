module.exports = function (grunt) {
    grunt.registerTask('staging-deploy-ticket', 'Set tickets to ticket number.', function (ticket) {
        grunt.config.set('ticket', ticket);
        grunt.task.run('sftp-deploy:dist_ticket');
    });
}