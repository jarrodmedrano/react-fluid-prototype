// NOTE: This file is set up to correctly determin the users OS and adjust file seperators as needed

var parameters = {
    dist: {
        auth: {
            host: 'c2278.paas2.tx.modxcloud.com',
            authKey: "modx-staging"
        },
        src: './dist',
        dest: 'www',
        serverSep: '/',
        localSep: '/',
        concurrency: 1,
        progress: true
    },
    dist_ticket: {
        auth: {
            host: 'c0063.paas2.tx.modxcloud.com',
            authKey: "modx-staging-review"
        },
        src: './dist',
        dest: 'www/tickets/<%= ticket %>',
        serverSep: '/',
        localSep: '/',
        concurrency: 1,
        progress: true
    }
}

if (process.platform == 'win32') {
    console.log('Updating separator for win32');
    for (var parameter in parameters) {
        parameters[parameter].localSep = '\\';
    }
}

module.exports = parameters;