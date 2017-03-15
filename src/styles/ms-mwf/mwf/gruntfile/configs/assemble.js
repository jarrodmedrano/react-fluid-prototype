require('../helpers/pathUpdates')();

module.exports = {
    options: {
        name: '<%= pkg.name %>', // project name in package.json
        helpers: ['helpers/handlebars/*.js'],
        version: '<%= pkg.version %>', // version number in package.json
        useDevToolbar: true,
        partials: [
            'core/templates/{components,modules,pages}/**/partials/**/*.hbs',
            'partners/**/templates/{components,modules,pages}/**/partials/**/*.hbs'
        ],
        data: ['temp/assemble-data/**/*.json']
    },
    buildCoreIndex: {
        options: {
            flatten: false,
            layout: 'partners/<%= partner %>/templates/layouts/base.hbs',
            data: ['temp/inventory/*.json'],
        },
        files: {'dist/core/index.html': 'core/templates/layouts/inventory-template.hbs'}
    },
    buildPartnerIndex: {
        options: {
            flatten: false,
            layout: 'partners/<%= partner %>/templates/layouts/base.hbs',
            data: ['temp/inventory/*.json'],
        },
        files: {'dist/partners/<%= partner %>/index.html': 'core/templates/layouts/inventory-template.hbs'}
    },
    core: {
        options: {
            flatten: false,
            layout: 'core/templates/layouts/config.hbs',
            plugins: ['../helpers/mwf-assemble-inventory'],
            inventory: {
                dest: 'temp/inventory',
                homepage: '/releases',
                relativeDestination: 'dist'
            }
        },
        files: [
            {
                expand: true,
                cwd: '',
                src: [
                    'core/templates/{components,modules}/**/test/**/*.hbs',
                    '!core/templates/**/fixtures/*.hbs'
                ],
                dest: './dist/',
                rename: removeTestFromPath
            }
        ]
    },
    fixtures: {
        options: {
            flatten: true,
            layout: 'core/templates/layouts/fixtures.hbs'
        },
        files: [
            {
                expand: true,
                cwd: '',
                src: [
                    'core/templates/{components,modules}/**/test/fixtures/*.hbs',
                    'core/scripts/**/fixtures/*.hbs'
                ],
                dest: './dist/',
                rename: removeTestFromPath
            }
        ]
    },
    partner: {
        options: {
            flatten: false,
            layout: 'partners/<%= partner %>/templates/layouts/base.hbs',
            data: ['temp/assemble-data/partners/<%= partner %>/**/*.json', 'temp/uhf.json'],
            plugins: ['../helpers/mwf-assemble-inventory'],
            partials: ['partners/modx/chunks/*.hbs'],
            inventory: {
                dest: 'temp/inventory',
                homepage: '/releases',
                relativeDestination: 'dist'
            }
        },
        files: [
            {
                expand: true,
                cwd: 'partners/',
                src: '<%= partner %>/templates/{components,modules,pages}/**/test/**/*.hbs',
                dest: './dist/partners/',
                rename: removeTestFromPath
            }
        ]
    },
    partnerReports: {
        options: {
            partials: ['core/templates/reporting/**/*.hbs']
        },
        files: [
            {
                expand: true,
                cwd: 'partners/<%= partner %>/templates/',
                src: '{components,modules}/**/report/**/*.hbs',
                dest: 'partners/<%= partner %>/templates/',
                rename: removeTestFromPath
            }
        ]
    },
    release: {
        options: {
            flatten: false,
            layout: 'core/templates/layouts/config.hbs'
        },
        files: [
            {
                expand: true,
                cwd: '',
                src: 'core/templates/{components,modules}/**/test/**/*.hbs',
                dest: './dist/releases/',
                rename: removeTestFromPath
            }
        ]
    },
    release_mdl: {
        options: {
            flatten: false,
            layout: "partners/mdl/templates/layouts/base.hbs",
        },
        files: [
            {
                expand: true,
                cwd: '',
                src: 'partners/MDL/templates/{components,modules,pages}/**/*.hbs',
                dest: './dist/releases/',
                rename: removeTestFromPath
            }
        ]
    },
    reports: {
        options: {
            partials: ['core/templates/reporting/**/*.hbs'],
        },
        files: [
            {
                expand: true,
                cwd: 'core/templates/',
                src: '{components,modules}/**/report/**/*.hbs',
                dest: 'core/templates/',
                rename: removeTestFromPath
            }
        ]
    },
    site_staging: {
        options: {
            data: ['temp/uhf.json', 'partners/modx/data/**/*.json', 'core/templates/components/**/example/**/*.json', 'core/templates/modules/**/example/**/*.json'],
            partials: ['partners/modx/chunks/*.hbs', 'partners/modx/partials/code-example.hbs', 'core/templates/components/**/example/*.hbs', 'core/templates/modules/**/example/*.hbs'],
            layout: false
        },
        files: [
            {
                expand: true,
                cwd: 'partners/modx/',
                src: '**/*.html',
                dest: 'dist/'
            },
            {
                expand: true,
                cwd: 'partners/modx/chunks/',
                src: '*.hbs',
                dest: 'dist/chunks/'
            },
            {
                expand: true,
                cwd: 'core/templates/',
                src: 'components/**/example/**/*.hbs',
                dest: 'dist/chunks/'
            },
            {
                expand: true,
                cwd: 'core/templates/',
                src: 'modules/**/example/**/*.hbs',
                dest: 'dist/chunks/'
            },
            {
                expand: true,
                cwd: 'partners/modx/template/',
                src: '**/*.hbs',
                dest: 'dist/template/'
            }
        ]
    },
    uhf: {
        options: {
            flatten: false,
            layout: 'core/templates/layouts/config.hbs'
        },
        files: [
            {
                expand: true,
                cwd: '',
                src: [
                    'core/templates/components/{universal-footer,universal-header}/**/test/**/*.hbs',
                    '!core/templates/**/fixtures/*.hbs'
                ],
                dest: './dist/',
                rename: removeTestFromPath
            }
        ]
    }
};