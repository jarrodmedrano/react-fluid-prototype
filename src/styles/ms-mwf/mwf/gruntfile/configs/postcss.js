var browserList = ['last 4 versions', 'last 5 Firefox versions'];
var allBrowsers = ['last 4 versions', 'last 5 Firefox versions', 'ie 8', 'ie 9'];

module.exports = {
    defaultFiles: {
        options: {
            processors: [
                require('autoprefixer')({
                    browsers: browserList
                })
            ]
        },
        src: ["temp/css/default/*.css"]
    },
    ie9: {
        options: {
            processors: [
                require('autoprefixer')({
                    browsers: ['ie 9']
                })
            ]
        },
        src: "temp/css/ie9/*.css"
    },
    ie8: {
        options: {
            processors: [
                require('autoprefixer')({
                    browsers: ['ie 8']
                })
            ]
        },
        src: "temp/css/ie8/*.css"
    },
    staging: {
        options: {
            processors: [
                require('autoprefixer')({
                    browsers: allBrowsers
                })
            ]
        },
        src: "temp/local/css/*.css"
    },
    reports: {
        options: {
            processors: [
                require('autoprefixer')({
                    browsers: allBrowsers
                })
            ]
        },
        src: "core/templates/{components,modules}/**/report/*.css"
    }
}