module.exports = {
    dist: ['dist'],
    html: [
        'dist/dev/**/*.html'
    ],
    js: [
        'dist/dev/html-styles-js/**/*.js',
        'temp/scripts/'
    ],
    release: [
        'dist/core/',
        'dist/partners/'
    ],
    reports: [
        'core/templates/{components,modules}/**/report/**/*.hbs',
        'temp/scss/reports'
    ],
    temp: [
        'temp'
    ],
    tempCssSubdirs: [
        'temp/css/{default,ie8,ie9}'
    ],
    tsTests: [
        'js-test-files/{fixtures,source}/**/*.{html,js}',
        '!js-test-files/source/vendor/**/*.js'
    ],
    partnerReports: [
        'partners/**/templates/{components,modules}/**/report/**/*.hbs',
        'temp/scss/reports'
    ]
};
